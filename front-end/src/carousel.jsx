import React from 'react';
import { Carousel } from 'react-bootstrap'; // Importamos el componente Carousel de React-Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de importar el CSS de Bootstrap

const CustomCarousel = () => {
    return (
    <Carousel fade>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="../public/images/Purple and White Modern E-sport Tournament Instagram Post.jpg"
          alt="Sunset Over the City"
        />
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src="../public/images/Purple and Blue Futuristic Gaming Youtube Banner (1).gif"
          alt="Canyon at Night"
        />
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src="../public/images/Banner de YouTube Gamer Neon Violeta.gif"
          alt="Cliff Above a Stormy Sea"
        />        
      </Carousel.Item>
    </Carousel>
  );
};

export default CustomCarousel;
