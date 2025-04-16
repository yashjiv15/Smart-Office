import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';
import WorkMaster from './WorkMaster';

class WorkTask extends Model {
  work_task_id: number;
  work_id: number;
  work_master_id: number;  // Add work_master_id
  work_task_status: number;
  work_owner: string[]; 
  work_document_vs_customer_document: object;
  created_by: string;
  created_at: Date;
  updated_by: string;
  updated_at: Date;
  is_deleted: boolean;
  is_assigned: boolean;
  Status: any;
  Work: any;
  workMaster?: WorkMaster;
  User: any;
}

WorkTask.init(
  {
    work_task_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    work_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'so_work',
        key: 'work_id',
      },
    },
    work_task_status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'so_status',
        key: 'status_id',
      },
    },
    work_owner: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    work_document_vs_customer_document: {
      type: DataTypes.JSON,
      allowNull: true,
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
    is_assigned: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
    work_master_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'so_work_master',
        key: 'work_master_id',
      },
    },
  },
  {
    sequelize,
    modelName: 'WorkTask',
    tableName: 'so_work_task',
    timestamps: false,
    underscored: true,
  }
);

export default WorkTask;
