import Link from "next/link";
import { ShoppingCart } from "lucide-react";

const books = [
  {
    title: "HCD E-Book",
    price: "$9,99",
    className: "",
    options: ["Kindle Format", "Amazon"],
    href: "http://www.amazon.com/dp/B00YJP1ODE",
    internal: "/product1",
  },
  {
    title: "HCD Paperback",
    price: "$21,99",
    className: "pricing-info",
    options: ["Paperback", "External store", "Available now"],
    href: "https://amzn.com/6058456630",
    internal: "/product1",
  },
  {
    title: "HCD Hardcover",
    price: "COMING SOON",
    className: "pricing-success",
    options: ["Hardcover", "Release pending", "Book edition"],
    href: "https://amzn.com/6058456630",
    internal: "/product1",
  },
];

export function BookCards() {
  return (
    <section className="book-band">
      <div className="book-band-bg" />
      <div className="container">
        <div className="pricing-grid">
          {books.map((book) => (
            <article key={book.title} className={`pricing-card ${book.className}`}>
              <h2>
                <Link href={book.internal}>{book.title}</Link>
              </h2>
              <div className="price-box">
                <span className="cart-icon">
                  <ShoppingCart size={28} />
                </span>
                <span className="starting">Starting at</span>
                <strong>{book.price}</strong>
              </div>
              <ul>
                {book.options.map((option) => (
                  <li key={option}>{option}</li>
                ))}
              </ul>
              <a className="button button-light" href={book.href} target="_blank" rel="noopener noreferrer">
                Buy Now
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
