
export type PraiseStyle = 'motivational' | 'humorous' | 'loving' | 'heroic' | 'poetic' | 'sincere' | 'friendly' | 'acrostic';

export type SpecialOccasion = 
  | 'none'
  | 'birthday'
  | 'mothers_day'
  | 'fathers_day'
  | 'valentines_day'
  | 'new_year'
  | 'wedding'
  | 'anniversary'
  | 'baby_birth'
  | 'promotion'
  | 'teachers_day'
  | 'thanks'
  | 'new_job'
  | 'graduation'
  | 'achievement';

export interface Profile {
  name: string;
  age: number;
  gender: 'Kadın' | 'Erkek' | 'Diğer';
  praiseStyle: PraiseStyle;
  specialOccasion?: SpecialOccasion;
}