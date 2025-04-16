import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

class Work extends Model {
  work_id: any;
  enquiry_id: number;
  work_status: string;
    created_by: any;
    updated_by: any;
    updated_at: any;
    Enquiry: any;
    Status: any;
  WorkTask: any;
  created_at: any;
}

Work.init(
  {
    work_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    enquiry_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    work_status: {
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
    modelName: 'Work',
    tableName: 'so_work',
    timestamps: false,
    underscored: true,
  }
);

export default Work;
