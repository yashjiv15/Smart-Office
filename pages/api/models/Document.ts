// src/app/api/models/Document.ts

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

class Document extends Model {
  document_id: number;
  document_name: string;
  created_by: string;
  created_at: Date;
  updated_by: string;
  updated_at: Date;
  is_deleted: boolean;
}

Document.init(
  {
    document_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    document_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: false,
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
        onUpdate: 'CURRENT_TIMESTAMP', // Use string value for onUpdate
      },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'Document',
    tableName: 'so_documents',
    timestamps: false,
    underscored: true,
  }
);

export default Document;
