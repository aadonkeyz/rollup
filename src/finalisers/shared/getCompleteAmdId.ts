/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { NormalizedOutputOptions } from '../../rollup/types';
import removeJsExtension from './removeJsExtension';

export default function getCompleteAmdId(
	options: NormalizedOutputOptions['amd'],
	chunkId: string
): string {
	if (options.autoId) {
		return `${options.basePath ? options.basePath + '/' : ''}${removeJsExtension(chunkId)}`;
	}

	// @ts-ignore
	return options.id || '';
}
