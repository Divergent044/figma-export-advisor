import './styles/theme.css';
import './styles/base.css';
import './styles/header.css';
import './styles/analysis-card.css';
import './styles/export-btn.css';
import './styles/format-density.css';
import './styles/step-panel.css';
import './styles/optimize.css';
import './styles/toast.css';

import 'figma-plugin-ds/dist/figma-plugin-ds.css';

import { initEventHandlers, initMessageHandler, applyTheme } from './handlers';
import { themeMode } from './state';

initEventHandlers();
initMessageHandler();
applyTheme(themeMode);
