import { execSync } from "child_process";

const runCommand = (command) => {
  console.log(`Ejecutando: ${command}`);
  execSync(command, { stdio: "inherit" });
};

try {
  runCommand("node scripts/createDatabase.js");
  runCommand("node scripts/syncDatabase.js");
  runCommand("node scripts/seedDatabase.js");

  console.log("Base de datos inicializada correctamente.");
} catch (error) {
  console.error("Error durante la inicialización de la base de datos.");
  process.exit(1);
}
