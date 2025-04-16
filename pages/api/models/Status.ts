// src/app/api/models/Status.ts

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

class Status extends Model {
  status_id: number;
  status: string;
  status_for: string;
}

Status.init(
  {
    status_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status_for: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Status',
    tableName: 'so_status',
    timestamps: false,
    underscored: true,
  }
);

export default Status;
