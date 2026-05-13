// Dados mockados de comentários/reviews

export interface Review {
  id: number;
  movieId: number; // Relaciona o comentário ao ID do filme
  user: string;
  rating: number;
  comment: string;
}

export const REVIEWS: Review[] = [
  { 
    id: 1, 
    movieId: 1, // Deadpool e Wolverine
    user: 'Rafael Lange', 
    rating: 5, 
    comment: 'Melhor filme do ano! A química entre os dois é incrível.' 
  },
  { 
    id: 2, 
    movieId: 1, 
    user: 'Arthur Lanches', 
    rating: 4, 
    comment: 'Muito engraçado, mas algumas piadas são internas demais.' 
  },
  { 
    id: 3, 
    movieId: 2, // Dragonball Evolution
    user: 'Goku P da vida', 
    rating: 1, 
    comment: 'Isso aqui não é Dragon Ball. Estragaram minha infância.' 
  },
  { 
    id: 4, 
    movieId: 4, // Clube da Luta
    user: 'Tyler D.', 
    rating: 5, 
    comment: 'A primeira regra é não falar sobre o clube.' 
  }
];