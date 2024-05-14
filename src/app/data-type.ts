
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
}
export interface Avatar {
  imageUrl: string;
  fileName: string;
  size: number;
}