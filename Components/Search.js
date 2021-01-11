// Création d'un dossier component, pour mettre tous nos components à l'intérieur
// Création de la view "recherche" de notre application de gestion de film

import React from 'react'
import { StyleSheet, View, Button, TextInput, FlatList, Text, ActivityIndicator} from 'react-native'
import films from '../Helpers/filmsData'
import FilmItem from './FilmItem'
import {getFilmsFromApiWithSearchedText} from '../API/TMDBApi'

class Search extends React.Component {
    constructor(props) {
        super(props)
        this.searchedText = ""
        this.page = 0       //Compteur pour connaître la page courante
        this.totalPages = 0     //Nombre de pages totales pour savoir si on a atteint la fin des retours de l'API TMDB
        this.state = { 
            films: [],
            isLoading: false
        }
    }

    _loadFilms() {
        this.setState({isLoading: true})

        if (this.searchedText.length > 0) {
            getFilmsFromApiWithSearchedText(this.searchedText, this.page+1).then(data => {  
                this.page = data.page
                this.totalPages = data.total_pages
                this.setState({ 
                    films: [...this.state.films, ...data.results ],     //Simplication permise par ES6 
                    isLoading: false 
                })
            })
        }
    }

    _displayLoading () {
        if (this.state.isLoading) {
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size='large'/>
                </View>
            )
        }
    }

    _searchTextInputChanged(text) {
        this.searchedText = text
    }

    _searchFilms () {
        this.page = 0
        this.setState ({
            films: []
        }, () => {
            console.log('Page :' + this.page + ' / TotalPages :' + this.totalPages + '/ Nombre de films : ' + this.state.films.length)
            this._loadFilms()
        })
        
    }

    _displayDetailForFilm = (idFilm) => {
        this.props.navigation.navigate('FilmDetail', { idFilm: idFilm})
    }

    render () {
        console.log(this.state.isLoading)
        return (
            <View style={styles.main_container}>

                <TextInput onSubmitEditing={() => this._searchFilms()} onChangeText={(text) => this._searchTextInputChanged(text)} style={styles.textinput} placeholder='titre de film'/>
                
                <Button style={{ height: 50}} title='Rechercher' onPress={() => this._searchFilms()}/> 

                <FlatList
                data={this.state.films}
                keyExtractor={(item) => item.id.toString()}
                onEndReachedThreashold={0.5}
                onEndReached={() => {
                    if (this.page < this.totalPages) {
                        this._loadFilms()
                    }
                }}
                renderItem={({item}) => <FilmItem film={item} displayDetailForFilm={this._displayDetailForFilm}/>}
                />
                {this._displayLoading()}

            </View>
        );
    }
}

export default Search 
// render () {...} equivaut à render = function () {...} : Simplification ES6
// la balise view: language utilisé est JSX, extension du JS, facilita la création de components 
//avec une syntaxe inspirée du HTML et XML.

const styles = StyleSheet.create ({
    main_container: {
        flex: 1
    },
    textinput: {
        marginLeft: 5, 
        marginRight: 5, 
        height: 50, 
        borderColor: '#000000', 
        borderWidth: 1, 
        paddingLeft: 5
    },
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 100,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
})