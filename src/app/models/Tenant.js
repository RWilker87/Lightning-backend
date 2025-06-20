// src/app/models/Tenant.js
import { Model, DataTypes } from 'sequelize';

class Tenant extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: DataTypes.STRING,
      },
      {
        sequelize,
        tableName: 'tenants',
      }
    );
    return this;
  }

  static associate(models) {
    this.hasMany(models.User, { foreignKey: 'tenant_id', as: 'users' });
    this.hasMany(models.License, { foreignKey: 'tenant_id', as: 'licenses' });
  }
}

// Garanta que esta linha exista no final!
export default Tenant;