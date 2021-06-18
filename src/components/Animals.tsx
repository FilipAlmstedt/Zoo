import axios from "axios"
import { useEffect, useState } from "react"
import { Animal } from "../models/Animal"
import { Link } from "react-router-dom";

export const Animals = () => {

    let animalsDefaultArray: Animal[] = [];
    const[animals, setAnimals] = useState(animalsDefaultArray);
    let feedMessageArray: string[] = [];

    let feedMessageStatus: boolean;

    useEffect(() => {
        axios.get<Animal[]>('https://animals.azurewebsites.net/api/animals').then((response) => {

            if(!localStorage.getItem('animals') || !localStorage.getItem('feedMessage')) {

                console.log("Animals is added to local storage...");
                
                localStorage.setItem('animals', JSON.stringify(response.data));
                setAnimals(response.data)
               
                // Lagra alla feedingMeddelanden ifall det gått fler än 4 timmar i LS
                localStorage.setItem('feedMessage', JSON.stringify(feedMessageArray));

            } else {

                console.log("Animals is added from local storage...");

                /* 
                    animalsArrayString måste ha ett satt värde för att inte bli null, 
                    Annars blir det error när man ska göra en parse från LS
                */
                let animalsArrayString = localStorage.getItem('animals') || "";
                let getAnimalsfromLS: Animal[] = JSON.parse(animalsArrayString);
                setAnimals(getAnimalsfromLS)

                // Hämta och använd meddelanden från LS
                let collectMeessagesFromLs = localStorage.getItem('feedMessage') || "";
                let feedingMessagesArray: string[] = JSON.parse(collectMeessagesFromLs)
                feedMessageArray = [...feedingMessagesArray];
                
            } 
        })
    }, []);
    
    
    
    let feedMeessageIndex = 0;

    let animalDivs = animals.map((animal) => {

        
        let fourHours = 60*60*1000*4;

        if(new Date(animal.lastFed).getTime()+fourHours <= new Date().getTime() && animal.isFed === false) {             
            
            feedMessageArray.push(animal.name +" är hungrig! Det är gått fler än fyra timmar!");
            // Lagra meddelanden i LS
            localStorage.setItem('feedMessage', JSON.stringify(feedMessageArray));
            feedMessageStatus = true;

        } else {

            feedMessageArray.push(animal.name +" är inte hungrig just nu!");
            // Lagra meddelanden i LS
            localStorage.setItem('feedMessage', JSON.stringify(feedMessageArray));
            feedMessageStatus = false;

        }
        
        return (
            <div key={animal.id} className="animalNotDetailedDiv">
                <h1>{animal.name}</h1>
                <img src={animal.imageUrl} alt="showing animal"/>
                <p>{animal.shortDescription}</p>
                <div className={feedMessageStatus ? 'feedingTimeDiv' : 'notFeedingTimeDiv'}>
                    <h3>Status: {feedMessageArray[feedMeessageIndex++]}</h3>
                </div>
                <Link to={"/animal/"+animal.id} className="infoLink">Visa mer information</Link>
            </div>
        );
    })
    
    return (
        <>
            <div className="welcome">
                <h1>Välkommen till Filips Zoo!</h1>
            </div>
            <div className="wrapper">
                {animalDivs}
            </div>
        </>
    )
}