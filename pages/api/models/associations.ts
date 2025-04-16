import Enquiry from './Enquiry';
import Customer from './Customer';
import Work from './Work';
import Status from './Status';
import Role from './Role';
import RolePermission from './RolePermission';
import Permission from './Permission';
import WorkTask from './WorkTask';
import WorkMaster from './WorkMaster';
import User from './User';

const defineAssociations = () => {
  Enquiry.belongsTo(Customer, { foreignKey: 'customer_id' });
  Enquiry.hasMany(Work, { foreignKey: 'enquiry_id' });
  Work.belongsTo(Enquiry, { foreignKey: 'enquiry_id' });

  // Define the association between Work and Status
  Work.belongsTo(Status, { foreignKey: 'work_status' });

  // Define the association between Enquiry and Status using enquiry_status as FK
  Enquiry.belongsTo(Status, { foreignKey: 'enquiry_status' });

  // Role model
  Role.hasMany(RolePermission, { foreignKey: 'role_id' });

  // Permission model
  Permission.hasMany(RolePermission, { foreignKey: 'permission_name' });

  // RolePermission model
  RolePermission.belongsTo(Role, { foreignKey: 'role_id' });
  RolePermission.belongsTo(Permission, { foreignKey: 'permission_name' });


  WorkTask.hasMany(WorkMaster, { foreignKey: 'work_master_id' });

  Work.hasMany(WorkTask, { foreignKey: 'work_id' });
};

export default defineAssociations;
