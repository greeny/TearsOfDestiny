<?php
/**
 * @author Tomáš Blatný
 */

use Ratchet\ConnectionInterface;
use Ratchet\Http\HttpServer;
use Ratchet\MessageComponentInterface;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;

if ($socket = @fsockopen('localhost', 8080)) {
    fclose($socket);
    echo ' [INFO]: Server already running.' . "\n";
    die(1);
}

require __DIR__ . '/vendor/autoload.php';

class Message
{
    const CONNECTED = 'connected';
    const DISCONNECTED = 'disconnected';
    const INFO = 'info';
    const LOGIN = 'login';
    const LOGOUT = 'logout';
    const LOBBY_CHAT_START_TYPING = 'lobby-chat-start-typing';
    const LOBBY_CHAT_STOP_TYPING = 'lobby-chat-stop-typing';

    /** @var string */
    private $raw;

    /**
     * @param string $content
     */
    public function __construct($content = NULL)
    {
        $this->raw = $content;
    }

    /**
     * @param  string $type
     * @param  mixed $data
     * @return Message
     */
    public static function create($type, $data)
    {
        $message = new self;
        $message
            ->setRaw('{}')
            ->setType($type)
            ->setData($data);
        return $message;
    }

    /**
     * @return string
     */
    public function getRaw()
    {
        return $this->raw;
    }

    /**
     * @param  string $raw
     * @return $this
     */
    public function setRaw($raw)
    {
        $this->raw = $raw;
        return $this;
    }

    /**
     * @param  string $type
     * @return $this
     */
    public function setType($type)
    {
        $original = json_decode($this->getRaw());
        $original->type = (string) $type;
        $this->setRaw(json_encode($original));
        return $this;
    }

    /**
     * @return  string
     */
    public function getType()
    {
        $original = json_decode($this->getRaw());
        return (string) $original->type;
    }

    /**
     * @param  mixed $data
     * @return $this
     */
    public function setData($data)
    {
        $original = json_decode($this->getRaw());
        $original->data = $data;
        $this->setRaw(json_encode($original));
        return $this;
    }

    /**
     * @return mixed
     */
    public function getData()
    {
        $original = json_decode($this->getRaw());
        return $original->data;
    }
}

class TearsOfDestiny implements MessageComponentInterface
{

    private $clients;
    private $map = [];

    public function __construct()
    {
        $this->clients = new SplObjectStorage;
        $this->log('Server started.');
    }

    public function __destruct()
    {
        $this->log('Server stopped.');
    }

    public function onOpen(ConnectionInterface $connection)
    {
        $this->log('Connected.', $connection->resourceId);
        $this->clients->attach($connection);
    }

    public function onClose(ConnectionInterface $connection)
    {
        $this->log('Disconnected.', $connection->resourceId);
        //$this->sendMessages(Message::create(Message::DISCONNECTED, ['id' => $connection->resourceId]), $connection);
        $this->clients->detach($connection);
        if (isset($this->map[$connection->resourceId])) {
            $this->sendMessages(Message::create(Message::LOGOUT, ['id' => $connection->resourceId]), $connection);
            unset($this->map[$connection->resourceId]);
        }
    }

    public function onError(ConnectionInterface $connection, \Exception $e)
    {
        $this->log('Error: ' . $e->getMessage());
    }

    public function onMessage(ConnectionInterface $connection, $msg)
    {
        $message = new Message($msg);
        $this->log('Received message: ' . $message->getRaw(), $connection->resourceId);
        switch($message->getType()) {
            case Message::INFO:
                $this->sendMessage(Message::create(Message::INFO, ['id' => $connection->resourceId, 'connections' => $this->map]), $connection);
                break;
            case Message::LOGIN:
                $this->map[$connection->resourceId] = $message->getData()->user;
                $this->sendMessages(Message::create(Message::LOGIN, ['id' => $connection->resourceId, 'user' => $message->getData()->user]), $connection);
                $this->sendMessage(Message::create(Message::INFO, ['id' => $connection->resourceId, 'connections' => $this->map]), $connection);
                break;
            case Message::LOGOUT:
                $this->sendMessages(Message::create(Message::LOGOUT, ['id' => $connection->resourceId]), $connection);
                unset($this->map[$connection->resourceId]);
                break;
            default:
                $data = $message->getData();
                $data->id = $connection->resourceId;
                $message->setData($data);
                $this->sendMessages($message, $connection);
        }
    }

    private function sendMessages(Message $message, ConnectionInterface $exclude = NULL)
    {
        foreach ($this->clients as $client) {
            if ($exclude !== $client) {
                $this->sendMessage($message, $client);
            }
        }
    }

    private function sendMessage(Message $message, ConnectionInterface $connection)
    {
        $this->log('Sent message ' . $message->getRaw(), $connection->resourceId);
        $connection->send($message->getRaw());
    }

    private function log($message, $id = NULL)
    {
        if ($id) {
            $id = '[#' . $id . ']';
        } else {
            $id = '[INFO]';
        }
        echo str_pad($id, 7, ' ', STR_PAD_LEFT) . ': ' . $message . "\n";
    }
}

$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new TearsOfDestiny
        )
    ),
    8080
);

$server->run();
