import React from "react";
import Form from 'react-bootstrap/Form';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { getSearchResults, getFacetedSearchResults } from '../searchService';
import { getSimilarItems, getPopularItems } from "../irService";
import Button from "react-bootstrap/Button";
import "../styles/search.css";
import { useState, useEffect } from 'react';

/**
 * Renders information about the user obtained from MS Graph
 * @param props 
 */

export const SearchLayout = () => {
    const [searchTerm, setSearchTerm] = useState("leather jacket with pockets");
    const [searchResults, setSearchResults] = useState(null);
    const [similarItems, setSimilarItems]= useState(null);
    const [recommendationsType, setRecommendationsType] = useState('Recommendations');

    const getSearchResults_handler = () => {
        getSearchResults(searchTerm).then(response => setSearchResults(response));
        getPopularRecommendations_handler();

    }

    const getRecommendations_handler = (itemId) => {
        getSimilarItems(itemId).then(response => setSimilarItems(response));
        setRecommendationsType("Similar Items");
    }

    const getPopularRecommendations_handler = () => {
        getPopularItems().then(response => setSimilarItems(response));
        setRecommendationsType("Popular Items");
    }
    
    const getFacetedSearchResults_handler = (facet) => {
        getFacetedSearchResults(searchTerm, facet).then(response => setSearchResults(response));
    }

    useEffect(() => {
        getSearchResults_handler();
    }, [searchTerm]);

    return (
        
        <Container fluid className="mw-100 vh-100"  >
            <Row className="mw-100 h-100">
                <Col style={{top:"15%"}} className='align-middle' lg="2" >
                    
                    {
                        searchResults != null &&
                        
                        <ListGroup variant="flush">
                            <ListGroup.Item as="li" className="text-left font-weight-bold">Filter by Key Words</ListGroup.Item>
                            {
                                searchResults.KeyPhrases.map((s,index) => (
                             
                                    <ListGroup.Item as="li" onClick={() => getFacetedSearchResults_handler(s)} style={{cursor:"pointer"}} className="text-left">{s}</ListGroup.Item>
                                ))
                            }
                        </ListGroup> 
                        
                        
                    }              
                </Col>
                <Col  className=''>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                        <InputGroup className="mb-3">
                            <Form.Control
                            type='text'
                            value={searchTerm}
                            placeholder="Search for product title or description. for e.g wallet or classy look"
                            aria-label="Search Term"
                            onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button variant="primary" onClick={getSearchResults_handler}>Search</Button>
                        </InputGroup>            

                        </ListGroup.Item>
                
                        <ListGroup.Item >
                        
                            {
                                searchResults != null &&
                                <ListGroup variant="flush">
                                    {
                                    searchResults.value.map((s,index) => (
                                    <ListGroup.Item className="d-flex align-items-left search-results" key={s.ItemId}>
                                        
                                        <ListGroup horizontal>
                                            
                                            <ListGroup.Item  className="search-results-item" as="li">
                                            <Card style={{ width: '13rem'}}>
                                                <Card.Img variant="top" src={s.ImageUrl} />
                                                <Card.Body style={{ width: '12rem'}}>
                                                    <Card.Text>{s.Title}</Card.Text>
                                                    <Card.Link style={{ width: '15rem', cursor:"pointer"}} className="font-weight-light" onClick={() => getRecommendations_handler(s.ItemId)}>
                                                        View Similar Items
                                                    </Card.Link>
                                                </Card.Body>
                                            </Card>
                                            </ListGroup.Item>
                                            
                                            <ListGroup.Item as="li" className="d-flex align-items-center search-results">{s.Description} </ListGroup.Item>
                                            
                                        </ListGroup>
                                        
                                    </ListGroup.Item> 
                                ))}
                                </ListGroup>
                            }
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col className='mw-100 hidden-md-down  left-nav' xs lg="2" >
                    <div style={{height:'100%'}}>
                    
                        {
                            similarItems != null &&
                            <ListGroup variant="flush">
                                <ListGroup.Item style={{ borderStyle:"none" }} as="li" className="font-weight-bold">{recommendationsType}</ListGroup.Item>
                                {
                                similarItems.items.map((s,index) => (
                                <ListGroup.Item className="d-flex align-items-left search-results">
                                     <ListGroup horizontal>
                                        
                                        <ListGroup.Item  className="search-results-item" as="li">
                                        <Card style={{ width: '10rem' }}>
                                            <Card.Img variant="top" src={s.ImageUrl} />
                                            <Card.Body>
                                                <Card.Text>{s.Title}</Card.Text>
                                            </Card.Body>
                                        </Card>
                                        </ListGroup.Item>
                                        
                                        <ListGroup.Item as="li" className="d-flex align-items-center search-results">{s.Description} </ListGroup.Item>
                                        
                                    </ListGroup>
                                   
                                </ListGroup.Item>      
                            
                            ))}
                            </ListGroup>
                        }
                    </div>
                </Col>
               
            </Row>
            </Container>

        
        
      
            
            
            
            

       
      
    );
    
}
