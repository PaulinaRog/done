import Link from "next/link";

export default function VerificationPage(): React.ReactElement {
  return (
    <main className="flex h-[80vh] w-full flex-col items-center justify-center">
      <span>Dziękujemy za potwierdzenie adresu e-mail!</span>
      <span>Kliknij tutaj, żeby wrócić do strony logowania:</span>
      <Link href="/konto/logowanie" className="underline">
        Powrót
      </Link>
    </main>
  );
}
