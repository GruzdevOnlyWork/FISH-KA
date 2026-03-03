import PptxGenJS from "pptxgenjs";
import fs from "fs";
import path from "path";

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pptx.author = "FISH-KA Team";
pptx.title = "FISH-KA — Функциональные возможности";

// ===== Color palette =====
const COLORS = {
  bg: "F5F9FA",
  dark: "1A2B3C",
  primary: "2A9D8F",
  accent: "E9853A",
  white: "FFFFFF",
  muted: "64748B",
  codeBg: "1E293B",
  codeText: "E2E8F0",
  lightGray: "F1F5F9",
};

function addTitleSlide() {
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.dark };

  slide.addText("FISH-KA", {
    x: 0.8,
    y: 1.5,
    w: 11.7,
    h: 1.5,
    fontSize: 54,
    fontFace: "Arial",
    bold: true,
    color: COLORS.accent,
    align: "center",
  });

  slide.addText("Рыболовный интернет-магазин", {
    x: 0.8,
    y: 3.0,
    w: 11.7,
    h: 0.8,
    fontSize: 28,
    fontFace: "Arial",
    color: COLORS.white,
    align: "center",
  });

  slide.addText(
    "Next.js 16  •  TypeScript  •  Supabase  •  Zustand  •  Tailwind CSS  •  shadcn/ui",
    {
      x: 0.8,
      y: 4.2,
      w: 11.7,
      h: 0.6,
      fontSize: 16,
      fontFace: "Arial",
      color: COLORS.primary,
      align: "center",
    }
  );

  slide.addShape(pptx.ShapeType.rect, {
    x: 4.5,
    y: 5.5,
    w: 4.3,
    h: 0.05,
    fill: { color: COLORS.accent },
  });

  slide.addText("Презентация функциональных возможностей", {
    x: 0.8,
    y: 5.8,
    w: 11.7,
    h: 0.6,
    fontSize: 14,
    fontFace: "Arial",
    color: COLORS.muted,
    align: "center",
  });
}

function addSectionSlide(title, subtitle) {
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.primary };

  slide.addText(title, {
    x: 0.8,
    y: 2.5,
    w: 11.7,
    h: 1.2,
    fontSize: 40,
    fontFace: "Arial",
    bold: true,
    color: COLORS.white,
    align: "center",
  });

  if (subtitle) {
    slide.addText(subtitle, {
      x: 1.5,
      y: 3.8,
      w: 10.3,
      h: 0.8,
      fontSize: 18,
      fontFace: "Arial",
      color: COLORS.dark,
      align: "center",
    });
  }
}

function addCodeSlide(title, filePath, code, description) {
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bg };

  // Header bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.33,
    h: 1.1,
    fill: { color: COLORS.dark },
  });

  slide.addText(title, {
    x: 0.6,
    y: 0.15,
    w: 10,
    h: 0.8,
    fontSize: 24,
    fontFace: "Arial",
    bold: true,
    color: COLORS.white,
  });

  // File path badge
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.6,
    y: 1.35,
    w: filePath.length * 0.115 + 0.6,
    h: 0.4,
    fill: { color: COLORS.primary },
    rectRadius: 0.1,
  });

  slide.addText(filePath, {
    x: 0.6,
    y: 1.35,
    w: filePath.length * 0.115 + 0.6,
    h: 0.4,
    fontSize: 11,
    fontFace: "Consolas",
    color: COLORS.white,
    align: "center",
  });

  // Description
  if (description) {
    slide.addText(description, {
      x: 0.6,
      y: 1.9,
      w: 12.1,
      h: 0.5,
      fontSize: 13,
      fontFace: "Arial",
      color: COLORS.muted,
    });
  }

  // Code block
  const codeY = description ? 2.5 : 2.0;
  const codeH = description ? 4.6 : 5.1;

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.5,
    y: codeY - 0.05,
    w: 12.3,
    h: codeH + 0.1,
    fill: { color: COLORS.codeBg },
    rectRadius: 0.15,
    shadow: {
      type: "outer",
      blur: 6,
      offset: 2,
      color: "000000",
      opacity: 0.2,
    },
  });

  // Terminal dots
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 0.8,
    y: codeY + 0.12,
    w: 0.15,
    h: 0.15,
    fill: { color: "EF4444" },
  });
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 1.05,
    y: codeY + 0.12,
    w: 0.15,
    h: 0.15,
    fill: { color: "EAB308" },
  });
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 1.3,
    y: codeY + 0.12,
    w: 0.15,
    h: 0.15,
    fill: { color: "22C55E" },
  });

  slide.addText(code, {
    x: 0.8,
    y: codeY + 0.45,
    w: 11.7,
    h: codeH - 0.5,
    fontSize: 11,
    fontFace: "Consolas",
    color: COLORS.codeText,
    valign: "top",
    paraSpaceAfter: 2,
    lineSpacingMultiple: 1.15,
  });
}

function addFeatureSlide(title, features) {
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bg };

  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.33,
    h: 1.1,
    fill: { color: COLORS.dark },
  });

  slide.addText(title, {
    x: 0.6,
    y: 0.15,
    w: 12,
    h: 0.8,
    fontSize: 24,
    fontFace: "Arial",
    bold: true,
    color: COLORS.white,
  });

  features.forEach((feat, i) => {
    const y = 1.5 + i * 1.05;
    const num = String(i + 1).padStart(2, "0");

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.6,
      y: y,
      w: 0.6,
      h: 0.6,
      fill: { color: COLORS.accent },
      rectRadius: 0.1,
    });

    slide.addText(num, {
      x: 0.6,
      y: y,
      w: 0.6,
      h: 0.6,
      fontSize: 16,
      fontFace: "Arial",
      bold: true,
      color: COLORS.white,
      align: "center",
      valign: "middle",
    });

    slide.addText(feat.title, {
      x: 1.5,
      y: y,
      w: 5,
      h: 0.35,
      fontSize: 15,
      fontFace: "Arial",
      bold: true,
      color: COLORS.dark,
    });

    slide.addText(feat.desc, {
      x: 1.5,
      y: y + 0.32,
      w: 10.5,
      h: 0.35,
      fontSize: 11,
      fontFace: "Arial",
      color: COLORS.muted,
    });
  });
}

function addArchSlide() {
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bg };

  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.33,
    h: 1.1,
    fill: { color: COLORS.dark },
  });

  slide.addText("Архитектура проекта", {
    x: 0.6,
    y: 0.15,
    w: 12,
    h: 0.8,
    fontSize: 24,
    fontFace: "Arial",
    bold: true,
    color: COLORS.white,
  });

  const boxes = [
    { label: "Next.js 16\nApp Router + SSR", x: 4.5, y: 1.5, color: COLORS.dark },
    { label: "React 19\nServer & Client\nComponents", x: 1.0, y: 3.0, color: COLORS.primary },
    { label: "Supabase\nPostgreSQL + Auth\n+ RLS", x: 4.5, y: 3.0, color: COLORS.primary },
    { label: "Zustand\nClient State\n+ Persist", x: 8.0, y: 3.0, color: COLORS.primary },
    { label: "Tailwind CSS\n+ shadcn/ui", x: 1.0, y: 5.0, color: COLORS.accent },
    { label: "Server Actions\nФормы + RPC", x: 4.5, y: 5.0, color: COLORS.accent },
    { label: "QR-коды\nqrcode.react", x: 8.0, y: 5.0, color: COLORS.accent },
  ];

  boxes.forEach((box) => {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: box.x,
      y: box.y,
      w: 3.2,
      h: 1.3,
      fill: { color: box.color },
      rectRadius: 0.15,
      shadow: {
        type: "outer",
        blur: 4,
        offset: 2,
        color: "000000",
        opacity: 0.15,
      },
    });

    slide.addText(box.label, {
      x: box.x,
      y: box.y,
      w: 3.2,
      h: 1.3,
      fontSize: 12,
      fontFace: "Arial",
      bold: true,
      color: COLORS.white,
      align: "center",
      valign: "middle",
    });
  });
}

function addTableSlide() {
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bg };

  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 13.33, h: 1.1,
    fill: { color: COLORS.dark },
  });

  slide.addText("Структура файлов проекта", {
    x: 0.6, y: 0.15, w: 12, h: 0.8,
    fontSize: 24, fontFace: "Arial", bold: true, color: COLORS.white,
  });

  const rows = [
    ["Файл / Папка", "Назначение"],
    ["app/page.tsx", "Главная страница (серверный компонент каталога)"],
    ["app/cart/page.tsx", "Корзина + оформление заказа + валидация"],
    ["app/product/[id]/page.tsx", "Детальная страница товара"],
    ["app/order/[qrCode]/page.tsx", "Страница заказа с QR-кодом"],
    ["app/auth/login/page.tsx", "Авторизация администратора"],
    ["app/admin/", "Админ-панель (дашборд, товары, заказы, сканер)"],
    ["components/catalog.tsx", "Каталог: фильтры, сортировка, поиск"],
    ["components/product-card.tsx", "Карточка товара в каталоге"],
    ["lib/cart-store.ts", "Zustand store корзины с persist"],
    ["lib/supabase/", "Клиенты Supabase (browser + server)"],
    ["scripts/*.sql", "SQL миграции и seed-данные"],
  ];

  const headerOpts = {
    fill: { color: COLORS.primary },
    color: COLORS.white,
    bold: true,
    fontSize: 12,
    fontFace: "Arial",
  };

  const cellOpts = {
    fontSize: 11,
    fontFace: "Consolas",
    color: COLORS.dark,
  };

  const descOpts = {
    fontSize: 11,
    fontFace: "Arial",
    color: COLORS.muted,
  };

  const tableRows = rows.map((row, idx) => {
    if (idx === 0) {
      return row.map((cell) => ({ text: cell, options: headerOpts }));
    }
    return [
      { text: row[0], options: { ...cellOpts, fill: { color: idx % 2 === 0 ? COLORS.lightGray : COLORS.white } } },
      { text: row[1], options: { ...descOpts, fill: { color: idx % 2 === 0 ? COLORS.lightGray : COLORS.white } } },
    ];
  });

  slide.addTable(tableRows, {
    x: 0.6,
    y: 1.4,
    w: 12.1,
    colW: [4.5, 7.6],
    border: { type: "solid", pt: 0.5, color: "E2E8F0" },
    rowH: 0.45,
  });
}

function addEndSlide() {
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.dark };

  slide.addText("Спасибо за внимание!", {
    x: 0.8, y: 2.0, w: 11.7, h: 1.2,
    fontSize: 44, fontFace: "Arial", bold: true,
    color: COLORS.accent, align: "center",
  });

  slide.addText("FISH-KA — современный рыболовный магазин", {
    x: 0.8, y: 3.5, w: 11.7, h: 0.8,
    fontSize: 20, fontFace: "Arial",
    color: COLORS.white, align: "center",
  });

  slide.addShape(pptx.ShapeType.rect, {
    x: 4.5, y: 4.8, w: 4.3, h: 0.05,
    fill: { color: COLORS.primary },
  });

  slide.addText("Next.js  •  TypeScript  •  Supabase  •  Zustand  •  Tailwind", {
    x: 0.8, y: 5.2, w: 11.7, h: 0.6,
    fontSize: 14, fontFace: "Arial",
    color: COLORS.muted, align: "center",
  });
}

// ===== BUILD PRESENTATION =====

// 1. Title
addTitleSlide();

// 2. Overview features
addFeatureSlide("Ключевые возможности", [
  { title: "SSR каталог товаров", desc: "Серверный рендеринг с Next.js App Router для SEO и быстрой загрузки" },
  { title: "Фильтрация и поиск", desc: "Многокритериальная клиентская фильтрация: категория, цена, текстовый поиск, сортировка" },
  { title: "Корзина с persist", desc: "Zustand store с сохранением в localStorage между сессиями" },
  { title: "QR-код заказов", desc: "Генерация уникального QR-кода для каждого заказа и система выдачи" },
  { title: "Админ-панель", desc: "Полный CRUD товаров, управление заказами, дашборд со статистикой" },
]);

// 3. Architecture
addArchSlide();

// 4. SSR
addCodeSlide(
  "1. Серверный рендеринг каталога",
  "app/page.tsx",
  `export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: rawProducts }, { data: categories }] =
    await Promise.all([
      supabase
        .from("products")
        .select(\`*,
          product_categories (
            categories:categories(id, name, slug, icon)
          )\`)
        .order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("name"),
    ])

  return (
    <Catalog
      initialProducts={productsWithCategories}
      categories={categories || []}
    />
  )
}`,
  "Server Component загружает данные из Supabase и передаёт в клиентский Catalog"
);

// 5. Filtering
addCodeSlide(
  "2. Клиентская фильтрация каталога",
  "components/catalog.tsx",
  `const filteredProducts = useMemo(() => {
  let products = [...initialProducts]

  if (selectedCategory) {
    const category = categories.find((c) => c.slug === selectedCategory)
    if (category) {
      products = products.filter((p) =>
        p.categories?.some((cat) => cat.category_id === category.id)
      )
    }
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase()
    products = products.filter((p) =>
      p.name.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query) ||
      p.brand?.toLowerCase().includes(query)
    )
  }

  // + фильтр по цене + сортировка
  return products
}, [initialProducts, selectedCategory, searchQuery, sortOption, ...])`,
  "Мгновенная фильтрация через useMemo без обращения к серверу"
);

// 6. Cart Store
addCodeSlide(
  "3. Zustand — управление корзиной",
  "lib/cart-store.ts",
  `export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product) => {
        set((state) => {
          const existing = state.items.find(
            (item) => item.product.id === product.id
          )
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            }
          }
          return { items: [...state.items, { product, quantity: 1 }] }
        })
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity, 0
        )
      },
    }),
    { name: "fish-ka-cart" }  // localStorage key
  ),
)`,
  "Persist middleware автоматически сохраняет корзину в localStorage"
);

// 7. Validation
addCodeSlide(
  "4. Валидация формы заказа",
  "app/cart/page.tsx",
  `const validateForm = () => {
  const newErrors = {}

  if (customerName && customerName.trim().length < 2) {
    newErrors.name = "Имя должно содержать минимум 2 символа"
  }

  if (customerPhone) {
    const phoneClean = customerPhone.replace(/[\\s\\-\\(\\)]/g, "")
    if (!/^(\\+7|8)\\d{10}$/.test(phoneClean)) {
      newErrors.phone =
        "Введите корректный номер телефона (+7 999 123-45-67)"
    }
  }

  if (!privacyAccepted) {
    newErrors.privacy =
      "Необходимо согласие на обработку персональных данных"
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}`,
  "Валидация телефона (regex), имени и обязательная галочка политики конфиденциальности"
);

// 8. QR Order
addCodeSlide(
  "5. Создание заказа с QR-кодом",
  "app/cart/page.tsx",
  `const handleCreateOrder = async () => {
  if (!validateForm()) return

  const supabase = createClient()
  const qrCode = \`FISHKA-\${Date.now()}-\${
    Math.random().toString(36).substring(2, 8).toUpperCase()
  }\`

  const { data: order } = await supabase
    .from("orders")
    .insert({
      qr_code: qrCode,
      customer_name: customerName || null,
      customer_phone: customerPhone || null,
      total_amount: getTotalPrice(),
      status: "pending",
    })
    .select().single()

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.product.id,
    quantity: item.quantity,
    price_at_time: item.product.price,
  }))

  await supabase.from("order_items").insert(orderItems)
  clearCart()
  router.push(\`/order/\${qrCode}\`)
}`,
  "Уникальный QR-код генерируется на клиенте, заказ сохраняется в Supabase"
);

// 9. Server Actions
addCodeSlide(
  "6. Server Actions — выдача заказа",
  "app/admin/orders/actions.ts",
  `"use server"

export async function issueOrderItem(formData: FormData) {
  const supabase = await createClient()
  const orderItemId = formData.get("orderItemId") as string

  const { data: orderItem } = await supabase
    .from("order_items")
    .select("quantity, product_id, is_issued")
    .eq("id", orderItemId)
    .single()

  if (!orderItem || orderItem.is_issued)
    throw new Error("Позиция уже выдана")

  // Атомарное списание со склада через RPC
  await supabase.rpc("issue_product_stock", {
    p_product_id: orderItem.product_id,
    p_quantity: orderItem.quantity,
  })

  await supabase
    .from("order_items")
    .update({ is_issued: true })
    .eq("id", orderItemId)

  revalidatePath(\`/admin/orders/\${qrCode}\`)
}`,
  "Server Action вызывает RPC-функцию PostgreSQL для атомарного списания остатков"
);

// 10. Auth
addCodeSlide(
  "7. Аутентификация — Supabase Auth",
  "app/auth/login/page.tsx",
  `const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  const supabase = createClient()
  setIsLoading(true)
  setError(null)

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    router.push("/admin")
    router.refresh()
  } catch (error: unknown) {
    setError(
      error instanceof Error
        ? error.message
        : "Произошла ошибка при входе"
    )
  } finally {
    setIsLoading(false)
  }
}`,
  "Email/password авторизация с перенаправлением в защищённую админ-панель"
);

// 11. RLS
addCodeSlide(
  "8. Row Level Security (RLS)",
  "scripts/001-create-tables.sql",
  `-- Включение RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders   ENABLE ROW LEVEL SECURITY;

-- Публичный доступ на чтение товаров
CREATE POLICY "Public read products"
  ON products FOR SELECT
  USING (true);

-- Публичное создание заказов
CREATE POLICY "Public create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Только авторизованные могут изменять товары
CREATE POLICY "Auth update products"
  ON products FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Только авторизованные могут удалять
CREATE POLICY "Auth delete products"
  ON products FOR DELETE
  USING (auth.role() = 'authenticated');`,
  "Безопасность на уровне БД: публичное чтение, запись только для авторизованных"
);

// 12. Responsive
addCodeSlide(
  "9. Адаптивный дизайн",
  "components/product-grid.tsx + header.tsx",
  `// Адаптивная сетка товаров (product-grid.tsx)
<div className="grid grid-cols-1 gap-4
  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>

// Мобильное меню через Sheet (header.tsx)
<Sheet open={isOpen} onOpenChange={setIsOpen}>
  <SheetTrigger asChild className="md:hidden">
    <Button variant="ghost" size="icon">
      <Menu className="h-6 w-6" />
    </Button>
  </SheetTrigger>
  <SheetContent side="right" className="w-[280px]">
    <nav className="flex flex-col gap-4">
      {navLinks.map((link) => (
        <Link key={link.href} href={link.href}>
          {link.label}
        </Link>
      ))}
    </nav>
  </SheetContent>
</Sheet>`,
  "Tailwind CSS breakpoints + Sheet (выезжающая панель) для мобильных устройств"
);

// 13. File table
addTableSlide();

// 14. End
addEndSlide();

// ===== SAVE =====
const outPath = path.resolve("FISH-KA_Presentation.pptx");
pptx.writeFile({ fileName: outPath }).then(() => {
  console.log(`Presentation saved: ${outPath}`);
});
