// src/services/riskCalculationService.js
import { factors } from "./spdaFactors.js";

/**
 * Realiza o cálculo completo de análise de risco de SPDA conforme a ABNT NBR 5419:2015.
 * @param {object} params - Objeto contendo todos os parâmetros de entrada do formulário.
 * @returns {object} - Objeto com os resultados detalhados do cálculo.
 */
function calculateRisk(params) {
  // Converte todos os inputs para número, quando aplicável, para segurança.
  const p = Object.fromEntries(
    Object.entries(params).map(([key, value]) => [
      key,
      isNaN(Number(value)) ? value : Number(value),
    ])
  );

  // --- 1. CÁLCULO DO NÚMERO DE EVENTOS PERIGOSOS POR ANO (N) ---
  const Ng = p.Ng || 0;

  // ND: Descargas diretas na estrutura (Eq. A.1)
  const Ad = p.L * p.W; // Simplificado conforme planilha, a norma completa usa projeções.
  const Cd = factors.cd[p.cd_localizacao] || 0;
  const ND = Ng * Ad * Cd * 1e-6;

  // NM: Descargas próximas à estrutura (Eq. A.4)
  const Am = 2 * 500 * (p.L + p.W) + Math.PI * 500 * 500;
  const NM = Ng * Am * 1e-6;

  // NI: Descargas diretas na linha (Eq. A.3)
  // Assumimos até duas linhas (energia e sinal)
  const Ci_energia = p.tem_linha_energia ? factors.ci[p.ci_energia] || 0 : 0;
  const Ct_energia = p.tem_linha_energia ? factors.ct[p.ct_energia] || 0 : 0;
  const Al_energia = p.tem_linha_energia ? 40 * p.Le_energia : 0; // Simplificação (h = 20m)
  const NI_energia = Ng * Al_energia * Ci_energia * Ct_energia * 1e-6;

  const Ci_sinal = p.tem_linha_sinal ? factors.ci[p.ci_sinal] || 0 : 0;
  const Ct_sinal = p.tem_linha_sinal ? factors.ct[p.ct_sinal] || 0 : 0;
  const Al_sinal = p.tem_linha_sinal ? 40 * p.Ls_sinal : 0; // Simplificação (h = 20m)
  const NI_sinal = Ng * Al_sinal * Ci_sinal * Ct_sinal * 1e-6;
  const NI = NI_energia + NI_sinal;

  // NL: Descargas próximas à linha (Eq. A.5)
  const Ce_energia = p.tem_linha_energia ? factors.ce[p.ce_energia] || 0 : 0;
  const Am_linha_energia = p.tem_linha_energia ? 4000 * p.Le_energia : 0;
  const NL_energia = Ng * Am_linha_energia * Ce_energia * Ct_energia * 1e-6;

  const Ce_sinal = p.tem_linha_sinal ? factors.ce[p.ce_sinal] || 0 : 0;
  const Am_linha_sinal = p.tem_linha_sinal ? 4000 * p.Ls_sinal : 0;
  const NL_sinal = Ng * Am_linha_sinal * Ce_sinal * Ct_sinal * 1e-6;
  const NL = NL_energia + NL_sinal;

  // --- 2. CÁLCULO DAS PROBABILIDADES (P) ---
  const PB = factors.pb[p.spda_classe] || 1;
  const PSPD = factors.pspd[p.pspd_nivel] || 1;
  const PTA = factors.pta[p.pta_medida] || 1;
  const PTU = factors.ptu[p.ptu_medida] || 1;
  const KS3 = factors.ks3[p.ks3_fiacao] || 1;

  const PA = PTA + (1 - PTA) * PB;
  const PU = PTU;
  const PC = PSPD; // Probabilidade de falha do DPS
  const PM = PC * KS3; // Probabilidade de falha do sistema devido a surtos na estrutura
  const PV = PSPD;
  const PW = PSPD * KS3;
  const PZ = PW;

  // --- 3. CÁLCULO DAS PERDAS (L) ---
  // L1: Perda de Vida
  const nt = p.pessoas_interior + p.pessoas_exterior;
  const nz = p.pessoas_exterior;
  const tz = p.tempo_exterior_pessoas;
  const ca = p.contem_animais ? 1 : 0;

  const LT_D1 = factors.lt_d1;
  const rt = factors.rt_piso[p.rt_piso] || 0;
  const rp_incendio = factors.rp_incendio[p.rp_incendio] || 1;
  const rf_risco = factors.rf_risco[p.rf_risco] || 0;
  const hz = factors.hz[p.hz_perigo] || 1;

  const LA = rt * LT_D1 * (ca / 1); //Simplificado
  const LU = (rt * LT_D1 * (nz * tz)) / (nt * 8760);
  const LF_D2 = factors.lf_d2[p.tipo_estrutura_d2] || 0;
  const LB = rp_incendio * rf_risco * hz * LF_D2;
  const LV = LB;
  // Outras perdas (LC, LM, LW, LZ para R1) são 0 pois não causam diretamente perda de vida.

  // --- 4. CÁLCULO DOS COMPONENTES DE RISCO (R = N * P * L) ---
  const RA1 = ND * PA * LA;
  const RB1 = ND * PB * LB;
  const RC1 = 0; // Descargas na linha não causam danos físicos diretos
  const RM1 = 0; // Descargas na linha não causam danos físicos diretos
  const RU1 = NI * PU * LU;
  const RV1 = NI * PV * LV;
  const RW1 = 0; // Descargas próximas à linha não causam danos físicos diretos
  const RZ1 = 0; // Descargas na estrutura não causam falha de sistema que leva à morte

  // Cálculo para R2, R3 e R4 segue uma lógica similar, mas com diferentes valores de L.
  // A implementação abaixo é uma representação funcional baseada na norma e nos exemplos.
  const LF_servico = 0.1; // Valor típico para perda de serviço público
  const R_servico = (ND * PB + NI * PC + NM * PM) * LF_servico;

  const LF_cultural = p.patrimonio_cultural ? 0.1 : 0;
  const R_cultural = (ND * PB + NI * PV) * LF_cultural;

  const ca_economico = p.contem_animais ? p.valor_animais / p.valor_total : 0;
  const cb_economico = p.valor_predio / p.valor_total;
  const cc_economico = p.valor_conteudo / p.valor_total;
  const cs_economico = p.valor_sistemas / p.valor_total;
  const ct_economico =
    ca_economico + cb_economico + cc_economico + cs_economico;
  const L4 =
    rp_incendio * rf_risco * LF_D2 * (ca_economico + cb_economico) +
    (cc_economico + cs_economico); // Fórmula simplificada
  const R_economico = (ND * PA + ND * PB + NI * PV + NM * PZ + NL * PW) * L4;

  // --- 5. CÁLCULO DOS RISCOS TOTAIS ---
  const R1 = RA1 + RB1 + RC1 + RM1 + RU1 + RV1 + RW1 + RZ1;
  const R2 = R_servico;
  const R3 = R_cultural;
  const R4 = R_economico;

  // --- 6. ANÁLISE FINAL ---
  const RT = factors.rt; // Risco Tolerável para R1
  const RT2 = 1e-3; // Risco Tolerável para R2
  const RT3 = 1e-4; // Risco Tolerável para R3
  const RT4 = 1e-3; // Risco Tolerável para R4 (ajustável)

  const formatExp = (num) => (num ? num.toExponential(2) : "0.00e+00");

  return {
    inputs: p,
    dangerousEvents: {
      ND: formatExp(ND),
      NI: formatExp(NI),
      NL: formatExp(NL),
      NM: formatExp(NM),
    },
    riskComponents: {
      RA1: formatExp(RA1),
      RB1: formatExp(RB1),
      RU1: formatExp(RU1),
      RV1: formatExp(RV1),
    },
    finalRisks: {
      R1: formatExp(R1),
      R2: formatExp(R2),
      R3: formatExp(R3),
      R4: formatExp(R4),
    },
    analysis: {
      R1: {
        risco: formatExp(R1),
        toleravel: RT.toExponential(2),
        necessita_protecao: R1 > RT,
      },
      R2: {
        risco: formatExp(R2),
        toleravel: RT2.toExponential(2),
        necessita_protecao: R2 > RT2,
      },
      R3: {
        risco: formatExp(R3),
        toleravel: RT3.toExponential(2),
        necessita_protecao: R3 > RT3,
      },
      R4: {
        risco: formatExp(R4),
        toleravel: RT4.toExponential(2),
        necessita_protecao: R4 > RT4,
      },
    },
  };
}

export default { calculateRisk };
