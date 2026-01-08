import "./Home.css";
import storyImg from "../assets/story.png";
import ingredientImg from "../assets/ingredients.png";
import chefImg from "../assets/chef.png";
import deliveryImg from "../assets/delivery.png";

function Home() {
  return (
    <div className="home-container">

      <h1 className="home-title">Our story</h1>

      {/* Our Story */}
      <div className="home-section">
        <div className="text">
          <p>
            We believe in good food. We launched Fresh Pan Pizza Best Excuse
            Awards on our Facebook fan page. Fans were given situations where
            they had to come up with wacky and fun excuses.
          </p>
          <p>
            The person with the best excuse won the Best Excuse Badge and won
            Pizzeria’s vouchers. Their enthusiastic response proved that
            Pizzeria’s Fresh Pan Pizza is the Tastiest Pan Pizza Ever.
          </p>
          <p>
            Ever since we launched the Tastiest Pan Pizza, people have not been
            able to resist the softest, cheesiest, crunchiest, butteriest pizza.
          </p>
        </div>

        <img src={storyImg} alt="Our story" />
      </div>

      {/* Ingredients */}
      <div className="home-section reverse">
        <img src={ingredientImg} alt="Ingredients" />

        <div className="text">
          <h2>Ingredients</h2>
          <p>
            We’re ruthless about goodness. We have no qualms about tearing up a
            day-old lettuce leaf or steaming a baby carrot.
          </p>
          <p>
            Chop. Steam. Stir. While they’re still young and fresh – that’s our
            motto. It makes the kitchen a better place.
          </p>
        </div>
      </div>

      {/* Our Chefs */}
      <div className="home-section">
        <div className="text">
          <h2>Our Chefs</h2>
          <p>
            They make sauces sing and salads dance. They create magic with skill,
            knowledge, passion, and stirring spoons.
          </p>
          <p>
            They know goodness so good, it doesn’t know what to do with itself.
            We do though. We send it to you.
          </p>
        </div>

        <img src={chefImg} alt="Our chefs" />
      </div>

      {/* Delivery */}
      <div className="delivery-section">
        <img src={deliveryImg} alt="delivery time" />
        <h3>45 min delivery</h3>
      </div>

      <footer className="footer">
        Copyrights © 2017 Pizzeria. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;
