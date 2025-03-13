const app = require("./app/app");
const appConfig = require("./app/share/configs/app.conf");

const PORT = appConfig.Port || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
