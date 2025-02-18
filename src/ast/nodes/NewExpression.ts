import type { NormalizedTreeshakingOptions } from '../../rollup/types';
import type { CallOptions } from '../CallOptions';
import type { HasEffectsContext } from '../ExecutionContext';
import { EMPTY_PATH, type ObjectPath, UNKNOWN_PATH } from '../utils/PathTracker';
import type * as NodeType from './NodeType';
import { type ExpressionNode, NodeBase } from './shared/Node';

export default class NewExpression extends NodeBase {
	declare arguments: ExpressionNode[];
	declare callee: ExpressionNode;
	declare type: NodeType.tNewExpression;
	protected deoptimized = false;
	private declare callOptions: CallOptions;

	hasEffects(context: HasEffectsContext): boolean {
		if (!this.deoptimized) this.applyDeoptimizations();
		for (const argument of this.arguments) {
			if (argument.hasEffects(context)) return true;
		}
		if (
			(this.context.options.treeshake as NormalizedTreeshakingOptions).annotations &&
			this.annotations
		)
			return false;
		return (
			this.callee.hasEffects(context) ||
			this.callee.hasEffectsWhenCalledAtPath(EMPTY_PATH, this.callOptions, context)
		);
	}

	hasEffectsWhenAccessedAtPath(path: ObjectPath): boolean {
		return path.length > 0;
	}

	initialise(): void {
		this.callOptions = {
			args: this.arguments,
			thisParam: null,
			withNew: true
		};
	}

	protected applyDeoptimizations(): void {
		this.deoptimized = true;
		for (const argument of this.arguments) {
			// This will make sure all properties of parameters behave as "unknown"
			argument.deoptimizePath(UNKNOWN_PATH);
		}
		this.context.requestTreeshakingPass();
	}
}
