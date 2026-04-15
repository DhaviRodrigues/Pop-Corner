// Dados mockados de filmes

export interface Movie {
  id: number;
  title: string;
  rating: number;
  ratingCount: string;
  image: string;
  synopsis: string;
  duration: string;
  classification: string;
  director: string;
  tags: string[];
}

export const MOVIES: Movie[] = [
  {
    id: 1,
    title: 'Deadpool e Wolverine',
    rating: 4.6,
    ratingCount: '1280 avaliações',
    image: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    synopsis: 'Um herói irresponsável e um mutante rabugento precisam unir forças para salvar o multiverso. Prepare-se para muita ação, piadas pesadas e garras de adamantium.',
    duration: '2h 07min',
    classification: '18 anos',
    director: 'Shawn Levy',
    tags: ['AÇÃO', 'COMÉDIA']
  },
  {
    id: 2,
    title: 'Dragonball Evolution',
    rating: 1.5,
    ratingCount: '500 avaliações',
    image: 'https://www.themoviedb.org/t/p/w1280/23PcKOqNdhKeMFzORzQGn5eC44N.jpg',
    synopsis: 'O jovem Goku embarca em uma jornada para reunir as sete Esferas do Dragão e salvar o mundo das mãos do perverso Lorde Piccolo.',
    duration: '1h 25min',
    classification: '10 anos',
    director: 'James Wong',
    tags: ['AVENTURA', 'FANTASIA']
  },
  {
    id: 3,
    title: 'Pânico 7',
    rating: 4.2,
    ratingCount: '620 avaliações',
    image: 'https://www.themoviedb.org/t/p/w1280/rEevavl5vebCVEd5imx7D1k8nmV.jpg',
    synopsis: 'Quando um novo Ghostface surge na pacata cidade onde Sidney Prescott reconstruiu sua vida, seus medos mais sombrios se tornam reais enquanto sua filha se torna o próximo alvo do assassino. Determinada a proteger sua família, Sidney terá que enfrentar os horrores do seu passado para acabar com o massacre de uma vez por todas.',
    duration: '1h 54min',
    classification: '18 anos',
    director: 'Kevin Williamson',
    tags: ['TERROR', 'COMÉDIA']
  },
  {
    id: 4,
    title: 'Clube da Luta',
    rating: 4.9,
    ratingCount: '1700 avaliações',
    image: 'https://www.themoviedb.org/t/p/w1280/mCICnh7QBH0gzYaTQChBDDVIKdm.jpg',
    synopsis: 'Um homem deprimido que sofre de insônia conhece um estranho vendedor de sabonetes chamado Tyler Durden. Eles formam um clube clandestino com regras rígidas onde lutam com outros homens cansados de suas vidas mundanas. Mas sua parceria perfeita é comprometida quando Marla chama a atenção de Tyler.',
    duration: '2h 19min',
    classification: '16 anos',
    director: 'David Fincher',
    tags: ['AVENTURA', 'FANTASIA']
  },
];