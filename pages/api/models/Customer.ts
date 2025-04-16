import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

class Customer extends Model {
  customer_id!: number;
  first_name!: string;
  last_name!: string;
  pan: any;
  adhaar: any;
}

Customer.init(
  {
    customer_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    spoc_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    spoc_mobile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    company_registration_number: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    company_mobile: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    company_gst: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    pan: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    adhaar: {
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
    modelName: 'Customer',
    tableName: 'so_customers',
    timestamps: true,
    underscored: true,
  }
);

export default Customer;
