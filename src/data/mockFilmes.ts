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
  year: number;
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
    tags: ['AÇÃO', 'COMÉDIA'],
    year: 2024
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
    tags: ['AVENTURA', 'FANTASIA'],
    year: 2009
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
    tags: ['TERROR', 'COMÉDIA'],
    year: 2025
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
    tags: ['AVENTURA', 'FANTASIA'],
    year: 1999
  },
  {
    id: 5,
    title: 'Deadpool e Wolverine',
    rating: 4.6,
    ratingCount: '1280 avaliações',
    image: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    synopsis: 'Um herói irresponsável e um mutante rabugento precisam unir forças para salvar o multiverso. Prepare-se para muita ação, piadas pesadas e garras de adamantium.',
    duration: '2h 07min',
    classification: '18 anos',
    director: 'Shawn Levy',
    tags: ['AÇÃO', 'COMÉDIA'],
    year: 2024
  },
  {
    id: 6,
    title: 'Sharknado',
    rating: 1.2,
    ratingCount: '450 avaliações',
    image: 'https://www.themoviedb.org/t/p/w1280/atEmHkVFTSGRYt2PeCiziQqbZnI.jpg',
    synopsis: 'Um furacão gigante atinge Los Angeles, trazendo consigo milhares de tubarões famintos. Um grupo de amigos precisa sobreviver a essa tempestade bizarra usando apenas motosserras e coragem.',
    duration: '1h 26min',
    classification: '14 anos',
    director: 'Anthony C. Ferrante',
    tags: ['AÇÃO', 'TERROR'],
    year: 2013
  },
  {
    id: 7,
    title: 'Bacurau',
    rating: 4.8,
    ratingCount: '2100 avaliações',
    image: 'https://www.themoviedb.org/t/p/w1280/qvmLAVqNB5TbGUa9QqQvXiFC4UR.jpg', 
    synopsis: 'Pouco após a morte de dona Carmelita, os moradores de um pequeno povoado no sertão brasileiro, chamado Bacurau, descobrem que a comunidade não consta mais nos mapas.',
    duration: '2h 11min',
    classification: '16 anos',
    director: 'Kleber Mendonça Filho',
    tags: ['SUSPENSE', 'FICÇÃO'],
    year: 2019
  },
  {
    id: 8,
    title: 'Hoje Eu Quero Voltar Sozinho',
    rating: 4.9,
    ratingCount: '1500 avaliações',
    image: 'https://www.themoviedb.org/t/p/w1280/mMSZyYMy1jMeeCWcD44RBJZAe2k.jpg',
    synopsis: 'Leonardo, um adolescente cego, tenta lidar com a mãe superprotetora enquanto busca sua independência. Sua vida muda completamente com a chegada de um novo aluno.',
    duration: '1h 36min',
    classification: '12 anos',
    director: 'Daniel Ribeiro',
    tags: ['DRAMA', 'ROMANCE'],
    year: 2014
  },
  {
    id: 9,
    title: 'A Vida Invisível',
    rating: 4.8,
    ratingCount: '900 avaliações',
    image: 'https://www.themoviedb.org/t/p/w1280/p5Ia6cQXeJRjnHMBmZx0JF9JSwc.jpg',
    synopsis: 'Duas irmãs no Rio de Janeiro dos anos 50 são separadas por um segredo conservador e passam décadas tentando se reencontrar.',
    duration: '2h 19min',
    classification: '16 anos',
    director: 'Karim Aïnouz',
    tags: ['DRAMA', 'HISTÓRICO'],
    year: 2019
  },
  {
    id: 10,
    title: 'Shrek',
    rating: 4.8,
    ratingCount: '4100 avaliações',
    image: 'https://www.themoviedb.org/t/p/w1280/wxeqfC221YMptRRdzxlijAh7q8l.jpg',
    synopsis: 'Um ogro tem sua paz interrompida por personagens de contos de fadas e faz um acordo para resgatar uma princesa.',
    duration: '1h 30min',
    classification: 'Livre',
    director: 'Andrew Adamson',
    tags: ['COMÉDIA', 'ANIMAÇÃO'],
    year: 2001
  },
  {
    id: 11,
    title: 'Batman: O Cavaleiro das Trevas',
    rating: 4.9,
    ratingCount: '6500 avaliações',
    image: 'https://www.themoviedb.org/t/p/w1280/4lj1ikfsSmMZNyfdi8R8Tv5tsgb.jpg',
    synopsis: 'Batman precisa enfrentar o Coringa, um vilão que deseja instaurar o caos absoluto em Gotham City.',
    duration: '2h 32min',
    classification: '12 anos',
    director: 'Christopher Nolan',
    tags: ['AÇÃO', 'DRAMA'],
    year: 2008
  },
  {
    id: 12,
    title: 'Interestelar',
    rating: 4.9,
    ratingCount: '5400 avaliações',
    image: 'https://www.themoviedb.org/t/p/w1280/6ricSDD83BClJsFdGB6x7cM0MFQ.jpg',
    synopsis: 'Um grupo de exploradores viaja através de um buraco de minhoca no espaço na tentativa de garantir a sobrevivência da humanidade.',
    duration: '2h 49min',
    classification: '10 anos',
    director: 'Christopher Nolan',
    tags: ['FICÇÃO', 'DRAMA'],
    year: 2014
  },
];