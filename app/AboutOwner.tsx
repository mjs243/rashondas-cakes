import Image from "next/image";

export default function AboutOwner() {
    return (
        <section className="bg-white py-12">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-pink-800 mb-4">
                    About Rashonda
                </h2>
                <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="md:w-1/3">
                        <Image
                            src={`${process.env.NEXT_PUBLIC_KEYSTONE_URL}/images/rashonda.webp`} // place a real image in `public/images/`
                            alt="Rashonda"
                            width={400}
                            height={400}
                            className="rounded-md object-cover"
                        />
                    </div>
                    <div className="md:w-2/3">
                        <p className="text-gray-700 mb-4">
                            Hi, I’m Rashonda! For as long as I can remember, I’ve had a
                            passion for bringing people together through sweet treats. From
                            my very first cake recipe to the wide variety of delectable
                            confections offered today, my mission has always been the same:
                            create homemade, premium-quality desserts that spark joy and
                            celebration.
                        </p>
                        <p className="text-gray-700">
                            Every cake we bake is handcrafted with fresh ingredients,
                            careful attention to detail, and a generous dash of love. Thank
                            you for stopping by — I hope our treats bring a smile to your
                            face!
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}