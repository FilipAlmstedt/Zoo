import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { AnimalDetails } from "../models/AnimalDetails";

interface IParams {
    id: string
}

export const Animal = () => {
    let {id} = useParams<IParams>();
    let defaultAnimal: AnimalDetails = {
        id: 0,
        name: "",
        latinName: "",
        yearOfBirth: 0,
        shortDescription: "",
        longDescription: "",
        imageUrl: "",
        isFed: false,
        lastFed: new Date().toISOString()
    }
   


    const [animal, setAnimal] = useState(defaultAnimal);
    const [feedmessage, setFeedMessage] = useState("");

    // Används så jag kan byta klassnamn på h3-taggen och visar olika färger på meddelandet
    const [feedingStatus, setFeedingStatus] = useState(false);

    // Används varje gång id:et byts
    useEffect(() => {

        // Funktion som kolla ifall man måste mata djuret
        const checkIfFeeding = (chosenAnimal: AnimalDetails) => {
            
            //console.log(new Date(chosenAnimal.lastFed).getTime(), new Date().getTime());
        
            let threeHours: number = 60*60*1000*3 // enhet: ms 

            // Ifall det gått fler än 3 tre timmar så nollställs knaoper igen
            if(
                new Date(chosenAnimal.lastFed).getTime()+threeHours <= new Date().getTime() 
                && chosenAnimal.isFed 
               
            ) {
                console.log(chosenAnimal.name,"har ätit upp och är hungrig igen");
                chosenAnimal.isFed = false;

                // Tanken var att man skulle använda funktionen changeAnimalAndStoreInLS man gör denna lösning för att slippa warning i konsolen
                for(let i=0; i<animalsLS.length; i++) {
                    if(animalsLS[i].id === parseInt(id)){
                        animalsLS[i] = chosenAnimal;
                        localStorage.setItem('animals', JSON.stringify(animalsLS));
                    }
                }

            } else {
                if(chosenAnimal.isFed) {
                    console.log(chosenAnimal.name,"är inte hungrig just nu.");   
                    let feedMessage: string = chosenAnimal.name + " är inte hungrig just nu."
                    setFeedingStatus(false);
                    setFeedMessage(feedMessage);
                } else {
                    console.log(chosenAnimal.name,"är hungrig");   

                    // Ifall det har gått mer än fyra timmar, visa meddelande att det är dags att mata djuret
                    let fourHours = 60*60*1000*4 // enhet i ms 

                    if(new Date(chosenAnimal.lastFed).getTime()+fourHours <= new Date().getTime()) {
                        console.log("Dags att mata igen!!!");
                        let feedMessage: string = "Matdags för " + chosenAnimal.name + "! Klicka på knappen nedan för att mata!"
                        setFeedingStatus(true);
                        setFeedMessage(feedMessage);
                    }

                }
            }
        }
        
        let animalsLS: AnimalDetails[] = JSON.parse(localStorage.getItem('animals') || "");

        // Deklarera variablen och sätt rätt djur variablen från LS. Kolla även ifall man matat djuret
        for(let i=0; i<animalsLS.length; i++) {
            if(animalsLS[i].id === parseInt(id)){
                setAnimal(animalsLS[i])
                checkIfFeeding(animalsLS[i]);
            }
        }

    }, [id])

    
    
    // Mata djuret och lagra i LS
    const feedAnimal = () => {
        animal.isFed = true;
        animal.lastFed = new Date().toISOString();
        setAnimal(animal);

        changeAnimalAndStoreInLS(animal);  // eslint-disable-next-line react-hooks/exhaustive-deps

        window.location.reload();
    }
    
    // Funktion som används när nåt i animal-objektet ändras och sen lagrar den i LS
    const changeAnimalAndStoreInLS = (chosenAnimal: AnimalDetails) => {
        let animalsLS: AnimalDetails[] = JSON.parse(localStorage.getItem('animals') || "");

        for(let i=0; i<animalsLS.length; i++) {
            if(animalsLS[i].id === parseInt(id)){
                animalsLS[i] = chosenAnimal;
                localStorage.setItem('animals', JSON.stringify(animalsLS));
            }
        }
    }

    return (
        
        <div className="animalContainer"> 

            <div className="titleDiv">
                <h1>{animal.name}</h1>
                <h3>Latinska namnet: {animal.latinName}</h3>
                <div>
                    <p>Senast matad: {animal.lastFed}</p>
                    <p>Födelseår: {animal.yearOfBirth}</p>
                </div>    
            </div>

            <hr />

            <div className="imageDiv">
                <img src={animal.imageUrl} alt="Showing the animal"/>
            </div>

            <hr />

            <div className="longAnimalDescription">
                <h3>Vem är {animal.name}?</h3>
                <p>{animal.longDescription}</p>
            </div>

            <hr />

            <div className={feedingStatus ? 'feedingTimeDiv' : 'notFeedingTimeDiv'}>
                <h4>Status: {feedmessage}</h4>
            </div>
                <button className="feedButton" disabled={animal.isFed} onClick={feedAnimal}>Mata {animal.name}!</button>
            
        </div>
        
    )
}