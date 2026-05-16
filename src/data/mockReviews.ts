// src/data/mockReviews.ts

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
    comment: 'A primeira regra é não falar sobre o filme.' 
  },
  { 
    id: 5, 
    movieId: 1, 
    user: 'Maria C.', 
    rating: 5, 
    comment: 'Ação pura do começo ao fim. O Ryan Reynolds nasceu para esse papel, absurdo!' 
  },
  { 
    id: 6, 
    movieId: 2, 
    user: 'Príncipe Vegeta', 
    rating: 1, 
    comment: 'Um verdadeiro insulto ao orgulho dos Saiyajins. Insetos!' 
  },
  { 
    id: 7, 
    movieId: 1, 
    user: 'João Nerd', 
    rating: 4, 
    comment: 'As cenas pós-créditos valem o ingresso. Só achei o vilão meio fraco.' 
  },
  { 
    id: 8, 
    movieId: 4, 
    user: 'Marla S.', 
    rating: 5, 
    comment: 'Sombrio, genial e completamente insano. Um clássico.' 
  },
  { 
    id: 9, 
    movieId: 3, // Filme genérico caso você adicione um ID 3 depois
    user: 'CinéfiloBR', 
    rating: 3, 
    comment: 'A direção de arte é linda, mas o roteiro se perde no terceiro ato.' 
  }
];