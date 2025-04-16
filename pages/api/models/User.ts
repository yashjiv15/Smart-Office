import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';
import Role from './Role';

class User extends Model {
  password: any;
  role: Role;
    is_deleted: boolean;
  email: any;
  first_name: any;
  last_name: any;
  user_role: any;
}

User.init(
  {
    email: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_role: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Role',
        key: 'role_id',
      },
    },
    is_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
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
      onUpdate: 'CURRENT_TIMESTAMP', // Use string value for onUpdate
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'so_users',
    timestamps: false,
    underscored: true,
  }
);

User.belongsTo(Role, { foreignKey: 'user_role', as: 'role' }); // Define the association

export default User;
