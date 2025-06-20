// src/app/models/License.js
import { Model, DataTypes } from 'sequelize';

class License extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        valid_until: DataTypes.DATE,
        active: DataTypes.BOOLEAN,
      },
      {
        sequelize,
        tableName: 'licenses',
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
  }
}

// Garanta que esta linha exista no final!
export default License;