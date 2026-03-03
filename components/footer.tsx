import Link from "next/link"
import Image from "next/image"
import { Fish, Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-card mt-12">
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/image.png" alt="FISH-KA" width={40} height={40} className="h-10 w-10 object-contain" />
              <span className="text-xl font-bold text-accent">FISH-KA</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Магазин рыболовных товаров. Удочки, катушки, приманки, снасти и аксессуары для настоящих рыбаков.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Каталог</h3>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">Все товары</Link>
              <Link href="/" className="hover:text-foreground transition-colors">Удочки</Link>
              <Link href="/" className="hover:text-foreground transition-colors">Катушки</Link>
              <Link href="/" className="hover:text-foreground transition-colors">Приманки</Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Информация</h3>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/cart" className="hover:text-foreground transition-colors">Корзина</Link>
              <span className="hover:text-foreground transition-colors cursor-default">О магазине</span>
              <span className="hover:text-foreground transition-colors cursor-default">Доставка и оплата</span>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Контакты</h3>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+7 (999) 123-45-67</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <span>info@fish-ka.ru</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>г. Москва, ул. Рыбацкая, 1</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} FISH-KA. Все права защищены.
        </div>
      </div>
    </footer>
  )
}
