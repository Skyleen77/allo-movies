import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from '../components/ui/card';

export default function Home({ movies }: { movies: any }) {
  return (
    <main>
      <div className="relative h-[500px] bg-[url('/hero.jpg')]">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/20" />

        <div className="relative z-10 px-10 py-20 mx-auto max-w-7xl">
          <div className="absolute -translate-x-1/2 left-1/2 top-10">
            <h2 className="text-3xl font-semibold text-center text-white">
              Allo Movie
            </h2>
          </div>

          <div className="absolute -translate-x-1/2 left-1/2 top-40">
            <h1 className="flex flex-col max-w-2xl text-white gap-y-3">
              <span className="text-6xl font-bold">Bienvenue,</span>
              <span className="text-4xl font-medium">
                Des millions de films, émissions télévisées et artistes.
              </span>
            </h1>

            <Button
              onClick={() => fetch('/api/send-notification')}
              variant="white"
              className="mt-5"
            >
              Envoyer une notification
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 px-5 py-10 mx-auto md:grid-cols-4 sm:grid-cols-3 lg:grid-cols-5 max-w-7xl">
        {movies &&
          movies?.length &&
          movies.map((movie: any) => (
            <Card key={movie.imdbID} className="overflow-hidden">
              <CardContent className="p-0 pb-4">
                <img src={movie.Poster} className="w-full" />
              </CardContent>
              <CardFooter>
                <CardTitle className="text-sm">{movie.Title}</CardTitle>
              </CardFooter>
            </Card>
          ))}
      </div>
    </main>
  );
}

export const getStaticProps = async () => {
  const res = await fetch(
    `https://www.omdbapi.com?s="batman"&apikey=${process.env.NEXT_PUBLIC_OPEN_API_KEY}`,
  );
  const data = await res.json();

  return {
    props: {
      movies: data?.Search,
    },
  };
};
