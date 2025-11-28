// src/pages/Home.tsx
import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton,
  IonModal,
  IonInput,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonBadge,
  IonAlert,
  IonLoading,
  IonToast,
} from "@ionic/react";
import {
  add,
  pencil,
  trash,
  save,
  close,
  people,
  cloudUpload,
} from "ionicons/icons";
import { contactService, Contact } from "../services/contactService";
import "./Home.css";

const Home: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [loadingAPI, setLoadingAPI] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  // Carregar contatos do Firebase
  const loadContacts = async () => {
    setLoading(true);
    try {
      const data = await contactService.getAll();
      setContacts(data);
    } catch (error) {
      console.error("Erro ao carregar contatos:", error);
      showMessage("Erro ao carregar contatos");
    } finally {
      setLoading(false);
    }
  };

  // Importar contatos da API JSONPlaceholder
  const importFromAPI = async () => {
    setLoadingAPI(true);
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      const data = await response.json();

      let imported = 0;
      for (const user of data) {
        await contactService.add({
          name: user.name,
          email: user.email,
        });
        imported++;
      }

      showMessage(`${imported} contatos importados com sucesso!`);
      loadContacts();
    } catch (error) {
      console.error("Erro ao importar contatos:", error);
      showMessage("Erro ao importar contatos");
    } finally {
      setLoadingAPI(false);
    }
  };

  const openAddModal = () => {
    setEditingContact(null);
    setFormData({ name: "", email: "" });
    setShowModal(true);
  };

  const openEditModal = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({ name: contact.name, email: contact.email });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      showMessage("Por favor, preencha nome e email");
      return;
    }

    setLoading(true);
    try {
      if (editingContact && editingContact.id) {
        // Atualizar contato existente
        await contactService.update(editingContact.id, {
          name: formData.name,
          email: formData.email,
        });
        showMessage("Contato atualizado com sucesso!");
      } else {
        // Adicionar novo contato
        await contactService.add({
          name: formData.name,
          email: formData.email,
        });
        showMessage("Contato adicionado com sucesso!");
      }

      setShowModal(false);
      setFormData({ name: "", email: "" });
      loadContacts();
    } catch (error) {
      console.error("Erro ao salvar contato:", error);
      showMessage("Erro ao salvar contato");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id: string) => {
    setContactToDelete(id);
    setShowDeleteAlert(true);
  };

  const handleDelete = async () => {
    if (!contactToDelete) return;

    setLoading(true);
    try {
      await contactService.delete(contactToDelete);
      showMessage("Contato excluído com sucesso!");
      setContactToDelete(null);
      loadContacts();
    } catch (error) {
      console.error("Erro ao excluir contato:", error);
      showMessage("Erro ao excluir contato");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <IonIcon icon={people} />
              Meus Contatos
            </div>
          </IonTitle>
          <IonButtons slot="end">
            <IonBadge color="light">{contacts.length}</IonBadge>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {contacts.length === 0 && !loading ? (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Nenhum contato encontrado</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p style={{ marginBottom: "15px" }}>
                Clique no botão + para adicionar seu primeiro contato ou importe
                da API
              </p>
              <IonButton
                expand="block"
                onClick={importFromAPI}
                disabled={loadingAPI}
              >
                <IonIcon slot="start" icon={cloudUpload} />
                {loadingAPI ? "Importando..." : "Importar da API"}
              </IonButton>
            </IonCardContent>
          </IonCard>
        ) : (
          <>
            <div style={{ padding: "10px" }}>
              <IonButton
                expand="block"
                fill="outline"
                onClick={importFromAPI}
                disabled={loadingAPI}
              >
                <IonIcon slot="start" icon={cloudUpload} />
                {loadingAPI ? "Importando..." : "Importar mais da API"}
              </IonButton>
            </div>

            <IonList>
              {contacts.map((contact) => (
                <IonItem key={contact.id}>
                  <IonLabel>
                    <h2>{contact.name}</h2>
                    <p>{contact.email}</p>
                  </IonLabel>
                  <IonButton
                    fill="clear"
                    color="primary"
                    onClick={() => openEditModal(contact)}
                  >
                    <IonIcon slot="icon-only" icon={pencil} />
                  </IonButton>
                  <IonButton
                    fill="clear"
                    color="danger"
                    onClick={() => confirmDelete(contact.id!)}
                  >
                    <IonIcon slot="icon-only" icon={trash} />
                  </IonButton>
                </IonItem>
              ))}
            </IonList>
          </>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={openAddModal}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        {/* Modal de Adicionar/Editar */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar color="primary">
              <IonTitle>
                {editingContact ? "Editar Contato" : "Novo Contato"}
              </IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>
                  <IonIcon icon={close} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonItem>
              <IonLabel position="floating">Nome completo</IonLabel>
              <IonInput
                value={formData.name}
                onIonInput={(e) =>
                  setFormData({ ...formData, name: e.detail.value! })
                }
                placeholder="Digite o nome"
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">E-mail</IonLabel>
              <IonInput
                type="email"
                value={formData.email}
                onIonInput={(e) =>
                  setFormData({ ...formData, email: e.detail.value! })
                }
                placeholder="Digite o e-mail"
              />
            </IonItem>
            <div style={{ marginTop: "20px" }}>
              <IonButton expand="block" onClick={handleSave}>
                <IonIcon slot="start" icon={save} />
                {editingContact ? "Salvar Alterações" : "Adicionar Contato"}
              </IonButton>
              <IonButton
                expand="block"
                fill="outline"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </IonButton>
            </div>
          </IonContent>
        </IonModal>

        {/* Alert de Confirmação */}
        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="Confirmar exclusão"
          message="Deseja realmente excluir este contato?"
          buttons={[
            {
              text: "Cancelar",
              role: "cancel",
            },
            {
              text: "Excluir",
              role: "confirm",
              handler: handleDelete,
            },
          ]}
        />

        {/* Loading */}
        <IonLoading isOpen={loading} message="Carregando..." />

        {/* Toast de notificações */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          position="bottom"
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
