export interface Service {
  id: number;
  name: string;
  category: string;
  description: string;
  fullDescription: string;
  price: number;
  imageUrl: string;
  duration: string;
  modality: string;
  features: string[];
  techTags: string[];
  status: string;
}
