export class Role {
	public Id: number;
	public UnitId: number;
	public Code: string;
	public Name: string;
	public Description: string;
	public IsLocked: boolean;
	public ModifiedUserId: number;
	public ModifiedDate: Date;
	public CreatedUserId: number;
	public CreatedDate: Date;
	public Selected: boolean;
	public StatusText: string;
	public Rights: any;
}

