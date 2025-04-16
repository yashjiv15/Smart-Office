// src/app/api/models/RolePermission.ts

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';
import Permission from './Permission';
import Role from './Role';

class RolePermission extends Model {
  permission_name: any;
  role_id: any;
  created_by: string;
  created_at: Date;
  updated_by: string;
  updated_at: Date;
  is_deleted: boolean;
    Permission: any;
}

RolePermission.init(
  {
    permission_name: {
      type: DataTypes.STRING,
      references: {
        model: Permission,
        key: 'permission_name',
      },
      primaryKey: true,
    },
    role_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Role,
        key: 'role_id',
      },
      primaryKey: true,
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
    modelName: 'RolePermission',
    tableName: 'so_roles_permissions',
    timestamps: false,
    underscored: true,
  }
);

export default RolePermission;
