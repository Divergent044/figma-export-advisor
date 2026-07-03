import { initEventHandlers, initMessageHandler, applyTheme } from './handlers';
import { themeMode } from './state';

initEventHandlers();
initMessageHandler();
applyTheme(themeMode);
