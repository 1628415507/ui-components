import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.util.LinkedList;
import java.util.Random;

public class SnakeGame extends JFrame {
    // 游戏常量
    private static final int TILE_SIZE = 20;
    private static final int GRID_WIDTH = 30;
    private static final int GRID_HEIGHT = 20;
    private static final int GAME_SPEED = 150; // 毫秒

    // 游戏组件
    private GamePanel gamePanel;
    private Timer gameTimer;
    
    // 游戏状态
    private LinkedList<Point> snake;
    private Point food;
    private Direction currentDirection;
    private boolean gameRunning;
    
    // 方向枚举
    private enum Direction {
        UP, DOWN, LEFT, RIGHT
    }

    public SnakeGame() {
        setTitle("贪吃蛇游戏");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setResizable(false);
        
        // 初始化游戏面板
        gamePanel = new GamePanel();
        add(gamePanel);
        
        // 设置键盘监听
        addKeyListener(new KeyAdapter() {
            @Override
            public void keyPressed(KeyEvent e) {
                handleKeyPress(e.getKeyCode());
            }
        });
        
        // 设置游戏定时器（先初始化）
        gameTimer = new Timer(GAME_SPEED, e -> updateGame());
        
        // 初始化游戏状态（在定时器初始化后调用）
        initializeGame();
        
        pack();
        setLocationRelativeTo(null);
    }
    
    // 初始化游戏状态
    private void initializeGame() {
        snake = new LinkedList<>();
        // 初始蛇位置 (居中)
        snake.add(new Point(GRID_WIDTH / 2, GRID_HEIGHT / 2));
        // 初始方向
        currentDirection = Direction.RIGHT;
        // 生成食物
        generateFood();
        gameRunning = true;
        gameTimer.start();
    }
    
    // 生成食物
    private void generateFood() {
        Random rand = new Random();
        while (true) {
            int x = rand.nextInt(GRID_WIDTH);
            int y = rand.nextInt(GRID_HEIGHT);
            food = new Point(x, y);
            
            // 确保食物不在蛇身上
            if (!snake.contains(food)) {
                break;
            }
        }
    }
    
    // 更新游戏状态
    private void updateGame() {
        if (!gameRunning) return;
        
        // 根据方向移动蛇头
        Point head = snake.getFirst();
        Point newHead = new Point(head);
        
        switch (currentDirection) {
            case UP:    newHead.y--; break;
            case DOWN:  newHead.y++; break;
            case LEFT:  newHead.x--; break;
            case RIGHT: newHead.x++; break;
        }
        
        // 检查碰撞
        if (newHead.x < 0 || newHead.x >= GRID_WIDTH || 
            newHead.y < 0 || newHead.y >= GRID_HEIGHT ||
            snake.contains(newHead)) {
            gameOver();
            return;
        }
        
        // 添加新蛇头
        snake.addFirst(newHead);
        
        // 检查是否吃到食物
        if (newHead.equals(food)) {
            generateFood();
        } else {
            // 没吃到食物则移除蛇尾
            snake.removeLast();
        }
        
        gamePanel.repaint();
    }
    
    // 处理键盘输入
    private void handleKeyPress(int keyCode) {
        switch (keyCode) {
            case KeyEvent.VK_UP:
                if (currentDirection != Direction.DOWN) 
                    currentDirection = Direction.UP;
                break;
            case KeyEvent.VK_DOWN:
                if (currentDirection != Direction.UP) 
                    currentDirection = Direction.DOWN;
                break;
            case KeyEvent.VK_LEFT:
                if (currentDirection != Direction.RIGHT) 
                    currentDirection = Direction.LEFT;
                break;
            case KeyEvent.VK_RIGHT:
                if (currentDirection != Direction.LEFT) 
                    currentDirection = Direction.RIGHT;
                break;
            case KeyEvent.VK_SPACE:
                if (!gameRunning) {
                    initializeGame();
                }
                break;
        }
    }
    
    // 游戏结束
    private void gameOver() {
        gameRunning = false;
        gameTimer.stop();
        JOptionPane.showMessageDialog(this, "游戏结束! 得分: " + (snake.size() - 1), "游戏结束", JOptionPane.INFORMATION_MESSAGE);
    }
    
    // 游戏面板类
    private class GamePanel extends JPanel {
        public GamePanel() {
            setPreferredSize(new Dimension(
                GRID_WIDTH * TILE_SIZE, 
                GRID_HEIGHT * TILE_SIZE
            ));
            // 修改背景颜色为黑色（原为Color.WHITE）
            setBackground(Color.BLACK);
        }
        
        @Override
        protected void paintComponent(Graphics g) {
            super.paintComponent(g);
            
            // 绘制食物
            g.setColor(Color.RED);
            g.fillRect(food.x * TILE_SIZE, food.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            
            // 绘制蛇
            g.setColor(Color.GREEN);
            for (Point p : snake) {
                g.fillRect(p.x * TILE_SIZE, p.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
            
            // 绘制蛇头（不同颜色）
            Point head = snake.getFirst();
            g.setColor(new Color(0, 200, 0));
            g.fillRect(head.x * TILE_SIZE, head.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            
            // 游戏结束时显示提示
            if (!gameRunning) {
                g.setColor(Color.WHITE);
                g.setFont(new Font("Arial", Font.BOLD, 20));
                String msg = "按空格键重新开始";
                int msgWidth = g.getFontMetrics().stringWidth(msg);
                g.drawString(msg, (getWidth() - msgWidth) / 2, getHeight() / 2);
            }
        }
    }
    
    // 主方法
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            SnakeGame game = new SnakeGame();
            game.setVisible(true);
        });
    }
}