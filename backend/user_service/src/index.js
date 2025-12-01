import { createApp } from "./app.js";
import {env} from "./config/env.js";
import './utils/faketoken.js';

const PORT = env.PORT || 3001;

const app = createApp();

app.listen(PORT, () => {
  console.log(`[Auth Service] running on port ${PORT}`);
});