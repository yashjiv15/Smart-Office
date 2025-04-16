// src/app/api/models/Permission.ts

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

class Permission extends Model {
  permission_name: any;
  permission_title: any;
  created_by: string;
  created_at: Date;
  updated_by: string;
  updated_at: Date;
  is_deleted: boolean;
}

Permission.init(
  {
    permission_name: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    permission_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      onUpdate: 'CURRENT_TIMESTAMP',
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'Permission',
    tableName: 'so_permissions',
    timestamps: false,
    underscored: true,
  }
);

export default Permission;
