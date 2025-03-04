import HeroCarousal from "@/components/HeroCarousal";
import ProductCard from "@/components/ProductCard";
import SearchInput from "@/components/SearchInput";
import { getAllProducts } from "@/lib/actions";
import Image from "next/image";

const page = async () => {
  const allProducts = await getAllProducts();
  return (
    <>
      <section className="px-6 md:px-20 py-24">
        <div className="flex max-xl:flex-col gap-16">
          <div className="flex flex-col justify-center">
            <p className="small-text">
              Smart Shopping Starts Here:
              {/* <Image
                src="/assets/icons/arrow-right.svg"
                alt=""
                width={16}
                height={16}
              /> */}
            </p>
            <h1 className="head-text">
              Unleash the Power of{" "}
              <span className="text-orange-400">PriceTracker</span>
            </h1>
            <p className="mt-6">
              Enter a URL, and immedietly get Product details, and prices.
            </p>
            {/* search input */}
            <SearchInput />
          </div>
          {/* hero craousal */}
          <HeroCarousal />
        </div>
      </section>

      <section className="trending-section">
        <h2 className="section-text">Trending</h2>
        <div className="flex flex-wrap gap-x-8 gap-y-16">
          {allProducts?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
};

export default page;
