import { WatchlistEntry } from '@/models/userWatchlist';
import { IUser } from '@/types/IUser';

export class User implements IUser {
  constructor(
    public id: string | number,
    public name: string,
    public email: string,
    public profile_picture: string,
    public favorite_genres: string[],
    public pipoka: number,
    public watchlist: WatchlistEntry[] = []
  ) {}

  getName(): string { return this.name; }
  getEmail(): string { return this.email; }
  getGenres(): string[] { return this.favorite_genres; }
  getProfilePicture(): string { return this.profile_picture; }
  getPipoka(): number { return this.pipoka; }
  getWatchlist(): WatchlistEntry[] { return this.watchlist; }

  setName(newName: string): void {
    this.name = newName;
  }


  addMovieToLocalWatchlist(idFilme: string): { valid: boolean; error: string } {
    const idLimpo = (idFilme || '').toString().trim();
    if (!idLimpo) return { valid: false, error: 'ID inválido.' };

    const jaExiste = this.watchlist.some(w => w.getIdFilme() === idLimpo);
    if (jaExiste) {
      return { valid: false, error: `O filme com ID "${idLimpo}" já está na watchlist.` };
    }

    const novoItem = WatchlistEntry.createEntry({ idFilme: idLimpo });
    this.watchlist.push(novoItem);
    return { valid: true, error: "" };
  }


  removeMovieFromLocalWatchlist(idFilme: string): { valid: boolean; error: string } {
    const idLimpo = (idFilme || '').toString().trim();
    const indice = this.watchlist.findIndex(w => w.getIdFilme() === idLimpo);
    
    if (indice === -1) {
      return { valid: false, error: `O filme com ID "${idLimpo}" não está na watchlist.` };
    }

    this.watchlist.splice(indice, 1);
    return { valid: true, error: "" };
  }
}