
import Layout from './Layout';
import React from "react";
const Contact = () => {
    return(<>
        <Layout
      title='Contact page'
      description='Connect us'
      className='container-fluid'
    />
    <h3 style={{color:"#303f9f", textShadow: "3px 1px 0px white,5px 2px 0px skyblue"}} className='text-center' >EMAIL:shrisenthuragency@gmail.com</h3>
    <h3 style={{color:"#303f9f", textShadow: "3px 1px 0px white,5px 2px 0px skyblue"}} className='text-center'>MOBILE:70107 57290</h3>
    <iframe  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3917.0150365255186!2d78.06313947238807!3d10.962236455744327!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baa2fd202b6f8af%3A0x46c5a5a79c0421e0!2sSHRI%20SENTHUR%20AGENCY!5e0!3m2!1sen!2sin!4v1683641483261!5m2!1sen!2sin" width="80%" height="450" style={{border:"0px",paddingLeft:"20%"}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
       </>);
}
export default Contact;
