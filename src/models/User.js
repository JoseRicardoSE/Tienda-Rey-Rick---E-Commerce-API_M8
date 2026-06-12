import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    fullName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    rut: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },

    address: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,
  },
);

export default User;
