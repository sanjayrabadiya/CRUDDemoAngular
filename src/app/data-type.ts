
export interface User {  
  id?:number;
  name?: string;
  userName?: string;
  email?: string;
  gender?: string;
  avatar?: Avatar;
  birthDate?: string;
  age?: number;
  language?: string;
  phoneNo?: string;
  address?: string;
  checkEdit?: boolean;
  active?:boolean;
}
export interface Avatar {
  imageUrl: string;
  fileName: string;
  size: number;
}

export interface Language { 
  id?:number,
  name?:string
}