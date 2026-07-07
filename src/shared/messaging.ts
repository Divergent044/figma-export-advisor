// ============================================================================
// Протокол сообщений между code.ts (Figma API) и ui.html (iframe)
// ============================================================================

import type { ExportFormat, ExportConstraint } from './types';

// ============================================================================
// Сообщения от UI → code.ts
// ============================================================================

export interface AnalyzeMessage {
	type: 'analyze';
}

export interface ValidateAndExportMessage {
	type: 'validate-and-export';
	format: ExportFormat;
	constraint: ExportConstraint;
}

export interface ForceExportMessage {
	type: 'force-export';
	format: ExportFormat;
	constraint: ExportConstraint;
}

export interface ConfirmPngExportMessage {
	type: 'confirm-png-export';
	format: ExportFormat;
	constraint: ExportConstraint;
}

export interface CancelMessage {
	type: 'cancel';
}

/** Объединённый тип всех сообщений от UI к code.ts */
export type UIMessage =
	| AnalyzeMessage
	| ValidateAndExportMessage
	| ForceExportMessage
	| ConfirmPngExportMessage
	| CancelMessage;
