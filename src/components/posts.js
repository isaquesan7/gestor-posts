
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/anchor-is-valid */

import React from "react";
import {Table} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { faTrashCan, faCircleExclamation, faEye, faCalendarDays, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

class Posts extends React.Component{

    // Construtor contendo todas as informações que serão utilizadas
    constructor(props){
        super(props);

        this.state = {
            id: 0,
            title: '',
            tags: '',
            published_at: Date,
            featured_until: Date,
            youtube_link: '',
            primary_text: '',
            secondary_text: '',
            seo_title: '',
            seo_tags: '',
            posts : [],
            modalAdd: false,
            modalEdit: false,
            modalView: false,
            search: '',
            filteredPosts: [],
        }
    }

    // Formatar a 'Tag' para visualização de postagem, CASO a mesma for feita com espaços ou sem virgulas (não possível neste app)
    formatTags = () => {
      const { seo_tags } = this.state;
    
      if (typeof seo_tags === 'string') {
        // Remove todas as vírgulas
        const tagString = seo_tags.replace(/\s/g, '');
    
        // Divide a sequência em várias tags com base em espaços em branco
        const tagArray = tagString.split(' ').map(tag => tag.trim());
    
        // Remove tags vazias (se houver)
        const filteredTags = tagArray.filter(tag => tag !== '');
    
        return filteredTags;
      } else if (Array.isArray(seo_tags)) {
        // Se `seo_tags` já for um array, retorne-o diretamente
        return seo_tags;
      } else {
        // Se `seo_tags` não for nem uma string nem um array, retorne uma string vazia
        return [];
      }
    };

    // Formata a entrada de dados, impedindo o usuário de digitar espaços em branco
    handleInputChange = (event) => {
      const { name, value } = event.target;
  
      // Expressão regular para remover espaços, pontos, números, e outros caracteres especiais.
      const tagFormatada = value.replace(/[^A-Za-z,]+/g, '');
  
      // Atualize o estado com o valor formatado
      this.setState({ [name]: tagFormatada });
    }

    // Coleta o value no input de pesquisa
    handleSearchChange = (event) => {
      this.setState({ search: event.target.value }, () => {
          this.filterPosts(); // Chame a função de filtro após atualizar o estado.
      });
    };

    // Filtrar os posts
    filterPosts = () => {
      const { search, posts } = this.state;
  
      const filteredPosts = posts.filter((post) => {
          // Realize a comparação do título da postagem com o termo de pesquisa.
          return post.title.toLowerCase().includes(search.toLowerCase());
      });
  
      this.setState({ filteredPosts });
    };
    
    // Chama todos as postagens presentes na API
    chamarPosts = () =>{
        fetch('https://gracious-elgamal.173-249-10-142.plesk.page/api/posts?paginated=true', {
          headers: {
            'Api-Authorization': 'Bearer $2y$10$x3wqNWc4ZonF6dVWKAPnMuU1A258mgKbGWziVPdL5mhzqQwlhQEqK',
            'Authorization': 'Bearer 35|bkdTKk4t5WoNeApCMkVwWLBhmkjtarmeULMfwKiW',
            'Content-Type': 'application/json',
          }
        })
          .then(response => response.json())
          .then(data => {
                this.setState({ posts : data.data.data })
          });
          
    }

    // Formata a data da API
    formatarData(dataIso) {
      const data = new Date(dataIso);
      return data.toLocaleString(); // Isso irá formatar a data no formato padrão do navegador
    }

    // Deleta a postagem especifica.
    deletarPosts = (id) => {
        fetch(`https://gracious-elgamal.173-249-10-142.plesk.page/api/posts/${id}`, {
            method: 'DELETE',
            headers: {
              'Api-Authorization': 'Bearer $2y$10$x3wqNWc4ZonF6dVWKAPnMuU1A258mgKbGWziVPdL5mhzqQwlhQEqK',
              'Authorization': 'Bearer 35|bkdTKk4t5WoNeApCMkVwWLBhmkjtarmeULMfwKiW',
              'Content-Type': 'application/json',
            }
          })
          .then(response => {
                if(response.status === 200){
                    this.chamarPosts();
                }
          })
          .catch(error => {
            console.log(error);
          });
    }

    // Carrega os dados da postagem especifica.
    carregarDados = (id) => {
        fetch(`https://gracious-elgamal.173-249-10-142.plesk.page/api/posts/${id}`, {
          method: 'GET',
          headers: {
            'Api-Authorization': 'Bearer $2y$10$x3wqNWc4ZonF6dVWKAPnMuU1A258mgKbGWziVPdL5mhzqQwlhQEqK',
            'Authorization': 'Bearer 35|bkdTKk4t5WoNeApCMkVwWLBhmkjtarmeULMfwKiW',
          }
        })
          .then(response => response.json())
          .then(post => {
            this.setState({
                id: post.data.id,
                title: post.data.title,
                tags: post.data.tags,
                published_at: post.data.published_at,
                featured_until: post.data.featured_until,
                youtube_link: post.data.youtube_link,
                primary_text: post.data.primary_text,
                secondary_text: post.data.secondary_text,
                seo_title: post.data.seo_title,
                seo_tags: post.data.seo_tags,
                updated_at: post.data.updated_at,
            })
          })
          this.abrirModalEdit();
    }

    // Carrega os dados da postagem especifica.
    carregarDadosView = (id) => {
          fetch(`https://gracious-elgamal.173-249-10-142.plesk.page/api/posts/${id}`, {
            method: 'GET',
            headers: {
              'Api-Authorization': 'Bearer $2y$10$x3wqNWc4ZonF6dVWKAPnMuU1A258mgKbGWziVPdL5mhzqQwlhQEqK',
              'Authorization': 'Bearer 35|bkdTKk4t5WoNeApCMkVwWLBhmkjtarmeULMfwKiW',
            }
          })
            .then(response => response.json())
            .then(post => {
              this.setState({
                  id: post.data.id,
                  title: post.data.title,
                  tags: post.data.tags,
                  published_at: post.data.published_at,
                  featured_until: post.data.featured_until,
                  youtube_link: post.data.youtube_link,
                  primary_text: post.data.primary_text,
                  secondary_text: post.data.secondary_text,
                  seo_title: post.data.seo_title,
                  seo_tags: post.data.seo_tags,
                  updated_at: post.data.updated_at,
              })
            })
            this.abrirModalView();
    }
      
    // Para registrar nova postagem
    registerPost = (post) => {
        fetch('https://gracious-elgamal.173-249-10-142.plesk.page/api/posts', {
          method: 'POST',
          headers: {
            'Api-Authorization': 'Bearer $2y$10$x3wqNWc4ZonF6dVWKAPnMuU1A258mgKbGWziVPdL5mhzqQwlhQEqK',
            'Authorization': 'Bearer 35|bkdTKk4t5WoNeApCMkVwWLBhmkjtarmeULMfwKiW',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(post),
        });
        this.chamarPosts();
        this.zerarState();
        this.fecharModalAdd();
    }

    // Para atualizar a postagem
    atualizarPost = (post) => {
        fetch(`https://gracious-elgamal.173-249-10-142.plesk.page/api/posts/${post.id}`, {
          method: 'PUT',
          headers: {
            'Api-Authorization': 'Bearer $2y$10$x3wqNWc4ZonF6dVWKAPnMuU1A258mgKbGWziVPdL5mhzqQwlhQEqK',
            'Authorization': 'Bearer 35|bkdTKk4t5WoNeApCMkVwWLBhmkjtarmeULMfwKiW',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(post),
        })

        this.chamarPosts();
        this.zerarState();
        this.fecharModalEdit();
    }

    // Zera o constructor
    zerarState(){
      this.setState({
        id: 0,
        title: '',
        tags: '',
        youtube_link: '',
        primary_text: '',
        secondary_text: '',
        seo_title: '',
        seo_tags: '',
        search: '',
    });
    }

    // Coletor de valores
    handleChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value,
      });
    };

    // Enviar solicitação
    submit = async (e) => {
        e.preventDefault();
        const { id, title, tags, published_at, featured_until, youtube_link, primary_text, secondary_text, seo_title, seo_tags, updated_at } = this.state;
      
        if (!title) {
          alert('O título é obrigatório.');
          return;
        }
      
        if (id === 0) {
          const post = {
            title,
            tags,
            published_at,
            featured_until,
            youtube_link,
            primary_text,
            secondary_text,
            seo_title,
            seo_tags,
            updated_at,
          };
          this.registerPost(post);

        } else {
          const post = {
            id,
            title,
            tags,
            youtube_link,
            primary_text,
            secondary_text,
            seo_title,
            seo_tags,
          };
          this.atualizarPost(post);
        }
    }

    // Renderiza a tabela
    renderAPP(){
      
      
          return <>
  
              <div className="div-table-top">
                  <div className="div-title"><h1>POSTAGEM</h1></div>
                  <div className="div-filter">

                  <input type="text" value={this.state.search} onChange={this.handleSearchChange} placeholder="Pesquisar por título"/>&nbsp; <i><FontAwesomeIcon icon={faMagnifyingGlass} /></i>

                  </div>
                  <div className="div-new-post"><a onClick={this.abrirModalAdd}>NOVA POSTAGEM</a></div>
              </div>
              <div className="container-table">
                <Table responsive className="table" bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>TITULO DO CONTEÚDO</th>
                            <th className="no-mobile">TAG</th>
                            <th className="no-mobile">PUBLICAÇÃO</th>
                            <th className="no-mobile">ATUALIZAÇÃO</th>
                            <th>ACESSO</th>
                            <th className="acao-th">AÇÃO</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.posts.map((posts) =>
      
                        <tr key={posts.id}>
                          <td>{posts.title}</td>
                          <td className="no-mobile">{posts.seo_tags}</td>
                          <td className="date-td no-mobile"><div className="date"><i><FontAwesomeIcon icon={faCalendarDays} /></i>&nbsp; {this.formatarData(posts.published_at)}</div></td>
                          <td className="date-td no-mobile"><div className="date"><i><FontAwesomeIcon icon={faCalendarDays} /></i>&nbsp; {this.formatarData(posts.updated_at)}</div></td>
                          <td><b>Liberado</b></td>
                          <td>
                            <div className="acao">
                              <div className="edit">
                                <a onClick={() => this.carregarDados(posts.id)}><FontAwesomeIcon icon={faPenToSquare} /></a>
                              </div>
                              <div className="delete">
                                <a onClick={() => this.deletarPosts(posts.id)}><FontAwesomeIcon icon={faTrashCan} /></a>
                              </div>
                              <div className="view">
                                <a onClick={() => this.carregarDadosView(posts.id)}><FontAwesomeIcon icon={faEye} /></a>
                              </div>
                            </div>
                          </td>
                        </tr>
                        )}
                    </tbody>
                </Table>
              </div>
          </>
    }

    // Renderiza a tabela - com os posts filtrados
    renderAPP2(){
      
      
          return <>
  
              <div className="div-table-top">
                  <div className="div-title"><h1>POSTAGEM</h1></div>
                  <div className="div-filter">

                  <input type="text" value={this.state.search} onChange={this.handleSearchChange} placeholder="Pesquisar por título"/>&nbsp; <i><FontAwesomeIcon icon={faMagnifyingGlass} /></i>

                  </div>
                  <div className="div-new-post"><a onClick={this.abrirModalAdd}>NOVA POSTAGEM</a></div>
              </div>
              <div className="container-table">
              <Table responsive className="table" bordered hover size="sm">
                  <thead>
                      <tr>
                          <th>TITULO DO CONTEÚDO</th>
                          <th className="no-mobile">TAG</th>
                          <th className="no-mobile">PUBLICAÇÃO</th>
                          <th className="no-mobile">ATUALIZAÇÃO</th>
                          <th>ACESSO</th>
                          <th className="acao-th">AÇÃO</th>
                      </tr>
                  </thead>
                  <tbody>
                      {this.state.filteredPosts.map((posts) =>
    
                      <tr key={posts.id}>
                        <td>{posts.title}</td>
                        <td className="no-mobile">{posts.seo_tags}</td>
                        <td className="date-td no-mobile"><div className="date"><i><FontAwesomeIcon icon={faCalendarDays} /></i>&nbsp; {this.formatarData(posts.published_at)}</div></td>
                        <td className="date-td no-mobile"><div className="date"><i><FontAwesomeIcon icon={faCalendarDays} /></i>&nbsp; {this.formatarData(posts.updated_at)}</div></td>
                        <td><b>Liberado</b></td>
                        <td>
                          <div className="acao">
                            <div className="edit">
                              <a onClick={() => this.carregarDados(posts.id)}><FontAwesomeIcon icon={faPenToSquare} /></a>
                            </div>
                            <div className="delete">
                              <a onClick={() => this.deletarPosts(posts.id)}><FontAwesomeIcon icon={faTrashCan} /></a>
                            </div>
                            <div className="view">
                              <a onClick={() => this.carregarDadosView(posts.id)}><FontAwesomeIcon icon={faEye} /></a>
                            </div>
                          </div>
                        </td>
                      </tr>
                      )}
                  </tbody>
              </Table>
              </div>
          </>
    }

    // Fechar a Modal de ADD POST
    fecharModalAdd = () => {
          this.setState({
            modalAdd: false,
            id: 0,
            title: '',
            tags: '',
            youtube_link: '',
            primary_text: '',
            secondary_text: '',
            seo_title: '',
            seo_tags: '',
            search: '',
          })
    }
    
    // Abrir a Modal de ADD POST
    abrirModalAdd = () => {
          this.setState({
            modalAdd: true,
            id: 0,
            title: '',
            tags: '',
            youtube_link: '',
            primary_text: '',
            secondary_text: '',
            seo_title: '',
            seo_tags: '',
            search: '',
          })
    }

    // Renderiza a Modal para nova Postagem
    renderModalAdd(){
      return(
        <Modal show={this.state.modalAdd} onHide={this.fecharModalAdd}>
          <Modal.Header closeButton>
            <Modal.Title>Nova Postagem</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div className="form-app">
            {this.renderFormAdd()}
          </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.fecharModalAdd}>
              Fechar
            </Button>
            <Button variant="primary" onClick={this.submit}>
              Postar
            </Button>
          </Modal.Footer>
        </Modal>
      )
    }

    // Renderiza o FORM para adicionar Postagem
    renderFormAdd(){
        return(

          <Form>

            <Form.Group className="mb-3 none">
                <Form.Label>ID:</Form.Label>
                <Form.Control type="text" value={this.state.id} readOnly={true} />
            </Form.Group>

            <Form.Group className="mb-3 title-modal-add">
                <Form.Label><b>Titulo da Postagem:</b>&nbsp; <i><FontAwesomeIcon icon={faCircleExclamation} /></i></Form.Label>
                <Form.Control type="text" id="title" name="title" value={this.state.title} onChange={this.handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Seo_Title:</Form.Label>
                <Form.Control type="text" id="seo_title" name="seo_title" value={this.state.seo_title} onChange={this.handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Primeiro Texto:</Form.Label>
                <Form.Control as="textarea" id="primary_text" name="primary_text" rows={3} value={this.state.primary_text} onChange={this.handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Segundo Texto:</Form.Label>
                <Form.Control as="textarea" id="secondary_text" name="secondary_text" rows={3} value={this.state.secondary_text} onChange={this.handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Link para youtube:</Form.Label>
                <Form.Control type="text" id="youtube_link" name="youtube_link" value={this.state.youtube_link} onChange={this.handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Tags:</Form.Label>
                <Form.Control type="text" id="seo_tags" name="seo_tags" value={this.state.seo_tags} onChange={this.handleInputChange} placeholder="Adicione tags separadas por vírgulas" />
            </Form.Group>
        </Form>

        )
    }


  // Fechar a Modal Edit
  fecharModalEdit = () => {
    this.setState({
      modalEdit: false,
      id: 0,
      title: '',
      tags: '',
      youtube_link: '',
      primary_text: '',
      secondary_text: '',
      seo_title: '',
      seo_tags: '',
      search: '',
    })
  }
    
  // Abrir a Modal Edit
  abrirModalEdit = () => {
    this.setState({
      modalEdit: true,
      id: 0,
      title: '',
      tags: '',
      youtube_link: '',
      primary_text: '',
      secondary_text: '',
      seo_title: '',
      seo_tags: '',
      search: '',
    })
}

  // Renderiza a Modal para Editar a Postagem
  renderModalEdit(){
      return(
        <Modal show={this.state.modalEdit} onHide={this.fecharModalEdit}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Postagem</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div className="form-app">
            {this.renderFormAdd()}
          </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.fecharModalEdit}>
              Fechar
            </Button>
            <Button variant="primary" onClick={this.submit}>
              Atualizar
            </Button>
          </Modal.Footer>
        </Modal>
      )
  }

  // Fechar a Modal
  fecharModalView = () => {
    this.setState({
      modalView: false,
      id: 0,
      title: '',
      tags: '',
      youtube_link: '',
      primary_text: '',
      secondary_text: '',
      seo_title: '',
      seo_tags: '',
      search: '',
    })
  }
    
  // Abrir a Modal
  abrirModalView = () => {
    this.setState({
      modalView: true,
      id: 0,
      title: '',
      tags: '',
      youtube_link: '',
      primary_text: '',
      secondary_text: '',
      seo_title: '',
      seo_tags: '',
      search: '',
    })
  }

  // Renderiza o FORM para visualizar Postagem
  renderFormView(){
      return(

        <Form>

          <Form.Group className="mb-3">
              <Form.Label>ID:</Form.Label>
              <Form.Control type="text" value={this.state.id} readOnly={true} />
          </Form.Group>

          <Form.Group className="mb-3 title-modal-add">
              <Form.Label>Title:</Form.Label>
              <Form.Control type="text" id="title" name="title" value={this.state.title} readOnly={true} />
          </Form.Group>

          <Form.Group className="mb-3">
              <Form.Label>Seo_Title:</Form.Label>
              <Form.Control type="text" id="seo_title" name="seo_title" value={this.state.seo_title} readOnly={true} />
          </Form.Group>

          <Form.Group className="mb-3">
              <Form.Label>Primary_text:</Form.Label>
              <Form.Control as="textarea" id="primary_text" name="primary_text" rows={3} value={this.state.primary_text} readOnly={true} />
          </Form.Group>

          <Form.Group className="mb-3">
              <Form.Label>Secondary_text:</Form.Label>
              <Form.Control as="textarea" id="secondary_text" name="secondary_text" rows={3} value={this.state.secondary_text} readOnly={true} />
          </Form.Group>

          <Form.Group className="mb-3">
              <Form.Label>Youtube_link:</Form.Label>
              <Form.Control type="text" id="youtube_link" name="youtube_link" value={this.state.youtube_link} readOnly={true} />
          </Form.Group>

          <Form.Group className="mb-3">
              <Form.Label>Tags:</Form.Label>
              <Form.Control type="text" id="seo_tags" name="seo_tags" value={this.formatTags()} readOnly={true} />
          </Form.Group>

          <Form.Group className="mb-3">
              <Form.Label>Published_at:</Form.Label>
              <Form.Control type="text" id="published_at" name="published_at" value={this.formatarData(this.state.published_at)} readOnly={true} />
          </Form.Group>

          <Form.Group className="mb-3">
              <Form.Label>Featured_until:</Form.Label>
              <Form.Control type="text" id="featured_until" name="featured_until" value={this.formatarData(this.state.featured_until)} readOnly={true} />
          </Form.Group>
      </Form>

      )
  }

  // Renderiza a Modal para visualizar a Postagem
  renderModalView(){
      return(
        <Modal show={this.state.modalView} onHide={this.fecharModalView}>
          <Modal.Header closeButton>
            <Modal.Title>Postagem</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div className="form-app">
            {this.renderFormView()}
          </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.fecharModalView}>
              Fechar
            </Button>
          </Modal.Footer>
        </Modal>
      )
  }

  
    // Inicia a API
    componentDidMount() {
      this.chamarPosts();
      this.filterPosts();
      this.renderModalView();
  }

    // Renderiza toda a aplicação
    render(){
        return(

        <>
            {this.renderModalAdd()}
            {this.renderModalEdit()}
            {this.renderModalView()}
            
            <div className="div-table">
              {this.state.search === '' ? this.renderAPP() : this.renderAPP2()}

              <div className="total-post">
                <p><b>{this.state.posts.length}</b> Postagens</p>
              </div>
            </div>
            
        </>
        )
    }
  }

export default Posts;