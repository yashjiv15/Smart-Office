import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';
import Status from './Status';
import Customer from './Customer';

class Enquiry extends Model {
  enquiry_id!: number;
  customer_id!: number;
  work_enquiry!: object;
  enquiry_status!: number; // Change to number
  created_by?: string;
  created_at!: Date;
  updated_by?: string;
  updated_at!: Date;
  is_deleted?: boolean;
    Customer: any;
    Status: any;
}

Enquiry.init(
  {
    enquiry_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Customer,
        key: 'customer_id',
      },
    },
    work_enquiry: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    enquiry_status: {
      type: DataTypes.INTEGER,
      references: {
        model: Status,
        key: 'status_id',
      },
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
    modelName: 'Enquiry',
    tableName: 'so_enquiry',
    timestamps: false,
    underscored: true,
  }
);


export default Enquiry;
