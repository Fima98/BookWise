interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  totalCopies: number;
  availableCopies: number;
  description: string;
  coverColor: string;
  coverImage: string;
  videoUrl?: string;
  summary: string;
  createdAt: Date | null;
  isLoaned?: boolean;
}
