import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

class WorkMaster extends Model {
  work_master_id: number;
  work_master: string;
  work_document: JSON;
  created_by: string;
  created_at: Date;
  updated_by: string;
  updated_at: Date;
  is_deleted: boolean;
    work_cost: any;
}

WorkMaster.init(
  {
    work_master_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    work_master: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    work_document: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    work_cost: {
      type: DataTypes.STRING,
      allowNull: false,
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
    modelName: 'WorkMaster',
    tableName: 'so_work_master',
    timestamps: false,
    underscored: true,
  }
);

export default WorkMaster;
