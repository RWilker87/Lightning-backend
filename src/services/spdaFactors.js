// src/services/spdaFactors.js

export const factors = {
    // Tabela A.1 – Fator de localização da estrutura (CD)
    cd: {
        'cercada_objetos_altos': 0.25,
        'cercada_objetos_iguais_baixos': 0.5,
        'isolada': 1.0,
        'isolada_topo_colina': 2.0,
    },

    // Tabela A.2 – Fator de instalação da linha (CI)
    ci: {
        'aerea': 1.0,
        'enterrada': 0.5,
        'enterrada_malha_aterramento': 0.01,
    },

    // Tabela A.3 – Fator tipo de linha (CT)
    ct: {
        'bt_sinal': 1.0,
        'at_com_transformador': 0.2,
    },

    // Tabela A.4 – Fator ambiental da linha (CE)
    ce: {
        'rural': 1.0,
        'suburbano': 0.5,
        'urbano': 0.1,
        'urbano_edificios_altos': 0.01,
    },

    // Tabela B.1 – Probabilidade de choque (PTA)
    pta: {
        'nenhuma': 1.0,
        'avisos_alerta': 0.1,
        'isolacao_eletrica_3mm': 0.01,
        'equipotencializacao_efetiva': 0.01,
        'restricoes_fisicas': 0.0,
    },

    // Tabela B.2 – Probabilidade de danos físicos (PB)
    pb: {
        'sem_spda': 1.0,
        'IV': 0.2,
        'III': 0.1,
        'II': 0.05,
        'I': 0.02,
        'I_com_metal': 0.01,
        'cobertura_metalica_completa': 0.0,
    },

    // Tabela B.3 – Probabilidade de falha do DPS (PSPD)
    pspd: {
        'nenhum_dps': 1.0,
        'III_IV': 0.05,
        'II': 0.02,
        'I': 0.01,
        'nota2_005': 0.005,
        'nota2_004': 0.004,
        'nota2_003': 0.003,
        'nota2_002': 0.002,
        'nota2_001': 0.001,
    },

    // Tabela B.4 – Fatores de linhas externas (CLD, CLI)
    // A chave é uma combinação para facilitar a busca
    cld_cli: {
        'aerea_nao_blindada_indefinida':   { cld: 1.0, cli: 1.0 },
        'enterrada_nao_blindada_indefinida':{ cld: 1.0, cli: 1.0 },
        'neutro_multiaterrado_nenhuma':   { cld: 1.0, cli: 0.2 },
        'enterrada_blindada_nao_interligada': { cld: 1.0, cli: 0.3 },
        'aerea_blindada_nao_interligada':   { cld: 1.0, cli: 0.1 },
        'enterrada_blindada_interligada': { cld: 1.0, cli: 0.0 },
        'aerea_blindada_interligada':       { cld: 1.0, cli: 0.0 },
        'cabo_em_dutos_protegido':        { cld: 0.0, cli: 0.0 },
        'nenhuma_linha_externa':          { cld: 0.0, cli: 0.0 },
        'interfaces_isolantes':           { cld: 0.0, cli: 0.0 },
    },

    // Tabela B.5 – Fator de fiação interna (KS3)
    ks3: {
        'nao_blindado_sem_cuidado': 1.0,
        'nao_blindado_evitando_lacos': 0.2,
        'nao_blindado_roteamento_cuidadoso': 0.01,
        'blindado_ou_eletrodutos': 0.0001,
    },

    // Tabela B.6 – Probabilidade de choque em linhas (PTU)
    ptu: {
        'nenhuma': 1.0,
        'avisos_alerta': 0.1,
        'isolacao_eletrica': 0.01,
        'restricoes_fisicas': 0.0,
    },
    
    // Tabela B.7 – Probabilidade de falha de equipamento (PEB)
    peb: {
        'sem_dps': 1.0,
        'DPS_III_IV': 0.05,
        'DPS_II': 0.02,
        'DPS_I': 0.01,
        'nota4_005': 0.005,
        'nota4_004': 0.004,
        'nota4_003': 0.003,
        'nota4_002': 0.002,
        'nota4_001': 0.001,
    },

    // Tabela B.8 – Probabilidade de falha (PLD) por tensão suportável (UW) e resistência (RS)
    pld: {
        // Chave: condicao
        'nao_blindada_ou_nao_interligada': { '1': 1.0, '1.5': 1.0, '2.5': 1.0, '4': 1.0, '6': 1.0, 'nao_informado': 1.0 },
        'blindada_interligada_rs_5_20':    { '1': 1.0, '1.5': 1.0, '2.5': 0.95, '4': 0.90, '6': 0.80, 'nao_informado': 1.0 },
        'blindada_interligada_rs_1_5':     { '1': 0.9, '1.5': 0.8, '2.5': 0.60, '4': 0.30, '6': 0.10, 'nao_informado': 0.9 },
        'blindada_interligada_rs_le_1':    { '1': 0.6, '1.5': 0.4, '2.5': 0.20, '4': 0.04, '6': 0.02, 'nao_informado': 0.6 },
    },

    // Tabela B.9 – Probabilidade de falha (PLI) por tipo de linha e tensão suportável (UW)
    pli: {
        // Chave: tipo_linha
        'energia': { '1': 1.0, '1.5': 0.6, '2.5': 0.3, '4': 0.16, '6': 0.1, 'nao_informado': 1.0 },
        'sinal':   { '1': 1.0, '1.5': 0.5, '2.5': 0.2, '4': 0.08, '6': 0.04, 'nao_informado': 1.0 },
    },
    
    // Tabela C.2 (simplificada) - Valores médios de LT, LF, LO
    lt_d1: 0.01, // Ferimentos
    lf_d2: { // Danos Físicos
        'risco_explosao': 0.1,
        'hospital_hotel_escola': 0.1,
        'entretenimento_publico_museu': 0.05,
        'industrial_comercial': 0.02,
        'outros': 0.01
    },
    lo_d3: { // Falhas de sistemas
        'risco_explosao': 0.1,
        'uti_hospital': 0.01,
        'outras_partes_hospital': 0.001,
    },
    
    // Tabela C.3 – Fator de redução por tipo de piso (rt)
    rt_piso: {
        'agricultura_concreto': 0.01,
        'marmore_ceramica': 0.001,
        'cascalho_tapete': 0.0001,
        'asfalto_linoleo_madeira': 0.00001,
    },

    // Tabela C.4 – Fator de redução por proteção de incêndio (rp)
    rp_incendio: {
        'nenhuma': 1.0,
        'manual': 0.5,
        'automatica': 0.2,
    },

    // Tabela C.5 – Fator de redução por risco de incêndio (rf)
    rf_risco: {
        'explosao_zonas_0_20': 1.0,
        'explosao_zonas_1_21': 0.1,
        'explosao_zonas_2_22': 0.001,
        'incendio_alto': 0.1,
        'incendio_normal': 0.01,
        'incendio_baixo': 0.001,
        'nenhum': 0.0,
    },
    
    // Tabela C.6 – Fator de perigo especial (hz)
    hz: {
        'nenhum': 1.0,
        'panico_baixo': 2.0,
        'panico_medio': 5.0,
        'dificil_evacuacao': 5.0,
        'panico_alto': 10.0,
    },
    
    // Outros valores
    ng: { 'AC':6.7,'AL':6.3,'AP':14,'AM':11.2,'BA':5.2,'CE':4.7,'DF':7.2,'ES':7.6,'GO':8,'MA':9.2,'MT':8.8,'MS':7.2,'MG':6.7,'PA':10.7,'PB':4.1,'PR':5.2,'PE':3.1,'PI':7.4,'RJ':8.4,'RN':3.2,'RS':4.3,'RO':11.3,'RR':11.9,'SC':4.3,'SP':7.9,'SE':4.6,'TO':10.6 },
    rt: 1e-5, // Risco Tolerável Padrão
};
