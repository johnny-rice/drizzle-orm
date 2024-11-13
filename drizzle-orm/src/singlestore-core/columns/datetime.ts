import type {
	ColumnBuilderBaseConfig,
	ColumnBuilderRuntimeConfig,
	GeneratedColumnConfig,
	HasGenerated,
	MakeColumnConfig,
} from '~/column-builder.ts';
import type { ColumnBaseConfig } from '~/column.ts';
import { entityKind } from '~/entity.ts';
import type { AnySingleStoreTable } from '~/singlestore-core/table.ts';
import type { SQL } from '~/sql/index.ts';
import { type Equal, getColumnNameAndConfig } from '~/utils.ts';
import { SingleStoreColumn, SingleStoreColumnBuilder } from './common.ts';

export type SingleStoreDateTimeBuilderInitial<TName extends string> = SingleStoreDateTimeBuilder<{
	name: TName;
	dataType: 'date';
	columnType: 'SingleStoreDateTime';
	data: Date;
	driverParam: string | number;
	enumValues: undefined;
	generated: undefined;
}>;

export class SingleStoreDateTimeBuilder<T extends ColumnBuilderBaseConfig<'date', 'SingleStoreDateTime'>>
	extends SingleStoreColumnBuilder<T, SingleStoreDatetimeConfig>
{
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	override generatedAlwaysAs(
		as: SQL<unknown> | (() => SQL) | T['data'],
		config?: Partial<GeneratedColumnConfig<unknown>>,
	): HasGenerated<this, {}> {
		throw new Error('Method not implemented.');
	}
	static override readonly [entityKind]: string = 'SingleStoreDateTimeBuilder';

	constructor(name: T['name'], config: SingleStoreDatetimeConfig | undefined) {
		super(name, 'date', 'SingleStoreDateTime');
		this.config.fsp = config?.fsp;
	}

	/** @internal */
	override build<TTableName extends string>(
		table: AnySingleStoreTable<{ name: TTableName }>,
	): SingleStoreDateTime<MakeColumnConfig<T, TTableName>> {
		return new SingleStoreDateTime<MakeColumnConfig<T, TTableName>>(
			table,
			this.config as ColumnBuilderRuntimeConfig<any, any>,
		);
	}
}

export class SingleStoreDateTime<T extends ColumnBaseConfig<'date', 'SingleStoreDateTime'>>
	extends SingleStoreColumn<T>
{
	static override readonly [entityKind]: string = 'SingleStoreDateTime';

	readonly fsp: number | undefined;

	constructor(
		table: AnySingleStoreTable<{ name: T['tableName'] }>,
		config: SingleStoreDateTimeBuilder<T>['config'],
	) {
		super(table, config);
		this.fsp = config.fsp;
	}

	getSQLType(): string {
		const hidePrecision = this.fsp === undefined || this.fsp === 0;
		const precision = hidePrecision ? '' : `(${this.fsp})`;
		return `datetime${precision}`;
	}

	override mapToDriverValue(value: Date): unknown {
		return value.toISOString().replace('T', ' ').replace('Z', '');
	}

	override mapFromDriverValue(value: string): Date {
		return new Date(value.replace(' ', 'T') + 'Z');
	}
}

export type SingleStoreDateTimeStringBuilderInitial<TName extends string> = SingleStoreDateTimeStringBuilder<{
	name: TName;
	dataType: 'string';
	columnType: 'SingleStoreDateTimeString';
	data: string;
	driverParam: string | number;
	enumValues: undefined;
	generated: undefined;
}>;

export class SingleStoreDateTimeStringBuilder<T extends ColumnBuilderBaseConfig<'string', 'SingleStoreDateTimeString'>>
	extends SingleStoreColumnBuilder<T, SingleStoreDatetimeConfig>
{
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	override generatedAlwaysAs(
		as: SQL<unknown> | (() => SQL) | T['data'],
		config?: Partial<GeneratedColumnConfig<unknown>>,
	): HasGenerated<this, {}> {
		throw new Error('Method not implemented.');
	}
	static override readonly [entityKind]: string = 'SingleStoreDateTimeStringBuilder';

	constructor(name: T['name'], config: SingleStoreDatetimeConfig | undefined) {
		super(name, 'string', 'SingleStoreDateTimeString');
		this.config.fsp = config?.fsp;
	}

	/** @internal */
	override build<TTableName extends string>(
		table: AnySingleStoreTable<{ name: TTableName }>,
	): SingleStoreDateTimeString<MakeColumnConfig<T, TTableName>> {
		return new SingleStoreDateTimeString<MakeColumnConfig<T, TTableName>>(
			table,
			this.config as ColumnBuilderRuntimeConfig<any, any>,
		);
	}
}

export class SingleStoreDateTimeString<T extends ColumnBaseConfig<'string', 'SingleStoreDateTimeString'>>
	extends SingleStoreColumn<T>
{
	static override readonly [entityKind]: string = 'SingleStoreDateTimeString';

	readonly fsp: number | undefined;

	constructor(
		table: AnySingleStoreTable<{ name: T['tableName'] }>,
		config: SingleStoreDateTimeStringBuilder<T>['config'],
	) {
		super(table, config);
		this.fsp = config.fsp;
	}

	getSQLType(): string {
		const hidePrecision = this.fsp === undefined || this.fsp === 0;
		const precision = hidePrecision ? '' : `(${this.fsp})`;
		return `datetime${precision}`;
	}
}

export type DatetimeFsp = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface SingleStoreDatetimeConfig<TMode extends 'date' | 'string' = 'date' | 'string'> {
	mode?: TMode;
	fsp?: DatetimeFsp;
}

export function datetime(): SingleStoreDateTimeBuilderInitial<''>;
export function datetime<TMode extends SingleStoreDatetimeConfig['mode'] & {}>(
	config?: SingleStoreDatetimeConfig<TMode>,
): Equal<TMode, 'string'> extends true ? SingleStoreDateTimeStringBuilderInitial<''>
	: SingleStoreDateTimeBuilderInitial<''>;
export function datetime<TName extends string, TMode extends SingleStoreDatetimeConfig['mode'] & {}>(
	name: TName,
	config?: SingleStoreDatetimeConfig<TMode>,
): Equal<TMode, 'string'> extends true ? SingleStoreDateTimeStringBuilderInitial<TName>
	: SingleStoreDateTimeBuilderInitial<TName>;
export function datetime(a?: string | SingleStoreDatetimeConfig, b?: SingleStoreDatetimeConfig) {
	const { name, config } = getColumnNameAndConfig<SingleStoreDatetimeConfig | undefined>(a, b);
	if (config?.mode === 'string') {
		return new SingleStoreDateTimeStringBuilder(name, config);
	}
	return new SingleStoreDateTimeBuilder(name, config);
}
