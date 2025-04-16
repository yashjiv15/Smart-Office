// src/app/api/models/Role.ts

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

class Role extends Model {
    role_id: any;
    role_name: any;
    is_deleted: boolean;
  created_by: string;
  updated_by: string;
}

Role.init(
  {
    role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    role_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
      created_by: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
       
      },
      updated_by: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
    
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
  },
  {
    sequelize,
    modelName: 'Role',
    tableName: 'so_roles',
    underscored: true,
  }
);

export default Role;
